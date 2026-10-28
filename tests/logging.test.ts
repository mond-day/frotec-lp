import { describe, it, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'fs'
import http from 'http'
import { SONDER_ASCII_LOGO } from '@/lib/logging/brand'
import {
  configureLogger,
  createLogger,
  effectiveTimeZone,
  logProcessStart,
  resetLoggerForTests,
  runWithRequestContext,
} from '@/lib/logging/logger'
import { errorInfo, sanitizeFields, sanitizeText } from '@/lib/logging/sanitize'
import { accessLogLevel, installAccessLog, logAccess, resolveRequestId, routeFromUrl } from '@/lib/logging/access-log'
import { parseConsoleArgs } from '@/lib/logging/console'

// Results of sanitizeFields are read several levels deep in these assertions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any

const FIXED_NOW = new Date('2026-10-26T18:41:04.000Z')

let out: string[] = []
let err: string[] = []

function capture(overrides: Parameters<typeof configureLogger>[0] = {}) {
  out = []
  err = []
  resetLoggerForTests()
  configureLogger({
    format: 'human',
    level: 'info',
    timeZone: 'America/Cuiaba',
    banner: true,
    stdout: (line) => out.push(line),
    stderr: (line) => err.push(line),
    now: () => FIXED_NOW,
    ...overrides,
  })
}

beforeEach(() => capture())

describe('banner Sonder Corp', () => {
  it('é exatamente a arte oficial (snapshot)', () => {
    const fixture = readFileSync('tests/fixtures/sonder-logo.txt', 'utf8').replace(/\n$/, '')
    assert.equal(SONDER_ASCII_LOGO, fixture)
    assert.equal(SONDER_ASCII_LOGO.split('\n').at(-1), '                         SONDER CORP')
    assert.ok(/^[# A-Z\n]+$/.test(SONDER_ASCII_LOGO), 'só ASCII, sem ANSI')
    assert.ok(Math.max(...SONDER_ASCII_LOGO.split('\n').map((l) => l.length)) <= 62)
  })

  it('aparece uma única vez por processo, com metadados logo abaixo', () => {
    process.env.APP_VERSION = '1.4.0'
    process.env.GIT_SHA = 'abc1234def5678'
    assert.equal(logProcessStart(), true)
    assert.equal(logProcessStart(), false)
    const text = out.join('\n')
    assert.equal(text.split('SONDER CORP').length - 1, 1)
    assert.equal(out[0], SONDER_ASCII_LOGO)
    assert.match(out[1], /^INF 14:41:04 \[boot\] service\.started service=frotec-lp environment=\S+ version=1\.4\.0 sha=abc1234def56 tz=America\/Cuiaba /)
  })

  it('LOG_BANNER=false omite a arte mas mantém a linha de boot', () => {
    capture({ banner: false })
    logProcessStart()
    assert.equal(out.length, 1)
    assert.match(out[0], /\[boot\] service\.started/)
  })

  it('modo JSON: nenhum banner, um evento service.started com brand', () => {
    capture({ format: 'json' })
    logProcessStart()
    createLogger('boot').info('database.ready', { latencyMs: 18 })
    createLogger().error('x.failed', { err: new Error('boom') })
    const lines = [...out, ...err]
    assert.ok(!lines.join('\n').includes('#####'))
    const parsed = lines.map((l) => JSON.parse(l))
    assert.equal(parsed[0].msg, 'service.started')
    assert.equal(parsed[0].brand, 'Sonder Corp')
    assert.equal(parsed[0].level, 'INFO')
    assert.equal(parsed[0].time, '2026-10-26T18:41:04.000Z')
  })
})

describe('formato', () => {
  it('humano compacto, hora no fuso do serviço', () => {
    createLogger('boot').info('database.ready', { latencyMs: 18 })
    assert.deepEqual(out, ['INF 14:41:04 [boot] database.ready latencyMs=18'])
    capture({ timeZone: 'America/Sao_Paulo' })
    createLogger().info('x')
    assert.equal(out[0], 'INF 15:41:04 x')
  })

  it('WARN/ERROR vão para stderr; DEBUG respeita LOG_LEVEL; ERROR nunca é filtrado', () => {
    const log = createLogger()
    log.debug('a')
    log.info('b')
    log.warn('c')
    log.error('d')
    assert.deepEqual(out, ['INF 14:41:04 b'])
    assert.deepEqual(err, ['WRN 14:41:04 c', 'ERR 14:41:04 d'])
    capture({ level: 'error' })
    createLogger().warn('hidden')
    createLogger().error('shown')
    assert.deepEqual(err, ['ERR 14:41:04 shown'])
  })

  it('erro mantém nome, mensagem e stack (só em ERROR) sem dados sensíveis', () => {
    const e = new Error('falhou para joao@sondercorp.com.br token=abc123')
    createLogger('api').error('user.update.failed', { userId: 'u1', err: e })
    const [first, ...stack] = err[0].split('\n')
    assert.match(first, /^ERR 14:41:04 \[api\] user\.update\.failed userId=u1 err="Error: falhou para j\*\*\*@sondercorp\.com\.br token=\[redacted\]"$/)
    assert.ok(stack.length > 0 && stack.every((l) => l.startsWith('    at ')))
    createLogger().warn('w', { err: e })
    assert.equal(err[1].split('\n').length, 1)
  })

  it('JSON: campos sem duplicar chaves reservadas', () => {
    capture({ format: 'json' })
    createLogger('jobs').info('job.done', { msg: 'x', time: 1, count: 2 })
    const rec = JSON.parse(out[0])
    assert.equal(rec.msg, 'job.done')
    assert.equal(rec.context, 'jobs')
    assert.equal(rec.field_msg, 'x')
    assert.equal(rec.field_time, 1)
    assert.equal(rec.count, 2)
  })

  it('anexa o requestId da requisição corrente', () => {
    runWithRequestContext({ requestId: 'abc123def456' }, () => createLogger().info('inside'))
    createLogger().info('outside')
    assert.deepEqual(out, ['INF 14:41:04 inside req=abc123def456', 'INF 14:41:04 outside'])
  })

  it('fuso efetivo: LOG_TIMEZONE > TZ; inválido é ignorado', () => {
    assert.equal(effectiveTimeZone({ TZ: 'America/Cuiaba' }), 'America/Cuiaba')
    assert.equal(effectiveTimeZone({ TZ: 'America/Cuiaba', LOG_TIMEZONE: 'UTC' }), 'UTC')
    assert.equal(effectiveTimeZone({ TZ: 'Nope/Invalid', LOG_TIMEZONE: 'America/Manaus' }), 'America/Manaus')
  })
})

describe('sanitização', () => {
  it('mascara chaves sensíveis recursivamente', () => {
    const clean = sanitizeFields({
      password: 'x',
      user: { passwordHash: 'h', apiKey: 'k', name: 'Ana' },
      headers: { Authorization: 'Bearer y', cookie: 'session_id=z' },
    }) as Loose
    assert.equal(clean.password, '[redacted]')
    assert.equal(clean.user.passwordHash, '[redacted]')
    assert.equal(clean.user.apiKey, '[redacted]')
    assert.equal(clean.user.name, 'Ana')
    assert.equal(clean.headers.Authorization, '[redacted]')
    assert.equal(clean.headers.cookie, '[redacted]')
  })

  it('mascara tokens, chaves, JWT, e-mail e query de URL em texto', () => {
    const text = sanitizeText(
      'Bearer sk_live1234567 sk_abcdefghij eyJhbGciOi.eyJzdWIiOi.c2lnbmF0dXJl ana.souza@x.com https://h.io/cb?token=1&a=2 password=hunter2'
    )
    assert.ok(!/live1234567|abcdefghij|eyJzdWIiOi|ana\.souza|token=1|hunter2/.test(text), text)
    assert.match(text, /a\*\*\*@x\.com/)
    assert.match(text, /https:\/\/h\.io\/cb\?\[redacted\]/)
  })

  it('impede injeção de linhas (CRLF) e remove ANSI', () => {
    createLogger().info('a\r\nINF 00:00:00 fake', { v: 'x\ny', c: '\u001b[31mred\u001b[0m' })
    assert.equal(out.length, 1)
    assert.ok(!out[0].includes('\n'))
    assert.match(out[0], /a\\nINF 00:00:00 fake/)
    assert.match(out[0], /c=red/)
  })

  it('trunca, limita profundidade, trata ciclos, BigInt e getters que lançam', () => {
    const circ: Record<string, unknown> = { a: 1 }
    circ.self = circ
    const bad = {}
    Object.defineProperty(bad, 'boom', { enumerable: true, get: () => { throw new Error('x') } })
    const clean = sanitizeFields({
      long: 'x'.repeat(5000),
      circ,
      deep: { a: { b: { c: { d: { e: 1 } } } } },
      big: BigInt(10),
      bad,
    }) as Loose
    assert.ok(clean.long.length < 1100)
    assert.equal(clean.circ.self, '[circular]')
    assert.equal(clean.deep.a.b.c, '[object]')
    assert.equal(clean.big, '10')
    assert.equal(clean.bad.boom, '[unreadable]')
    assert.doesNotThrow(() => createLogger().info('ok', { circ, bad }))
  })

  it('erro do Prisma: só a causa, sem a chamada com os dados', () => {
    const e = new Error('\nInvalid `prisma.user.update()` invocation:\n\n{ data: { passwordHash: "abc" } }\n\nUnique constraint failed on the fields: (`email_address`)')
    e.name = 'PrismaClientKnownRequestError'
    ;(e as Error & { code?: string }).code = 'P2002'
    const info = errorInfo(e)
    assert.equal(info.message, 'Unique constraint failed on the fields: (`email_address`)')
    assert.equal(info.code, 'P2002')
  })
})

describe('access log', () => {
  it('requestId: propaga se válido, gera se ausente/inválido', () => {
    assert.equal(resolveRequestId('abcd-1234-efgh'), 'abcd-1234-efgh')
    for (const bad of [undefined, '', 'short', 'x'.repeat(65), 'abc\r\nINF fake12', 'a b c d e f g h']) {
      assert.match(resolveRequestId(bad), /^[0-9a-f]{12}$/)
    }
  })

  it('rota sem query string', () => {
    assert.equal(routeFromUrl('/reset-password?token=segredo'), '/reset-password')
    assert.equal(routeFromUrl('/api/items#x'), '/api/items')
    assert.equal(routeFromUrl(undefined), '/')
  })

  it('níveis: 2xx/3xx INF, 4xx WRN, 5xx ERR; healthcheck ok vira DEBUG, falha não', () => {
    assert.equal(accessLogLevel('/api/items', 200), 'info')
    assert.equal(accessLogLevel('/login', 307), 'info')
    assert.equal(accessLogLevel('/api/items', 409), 'warn')
    assert.equal(accessLogLevel('/api/items', 500), 'error')
    assert.equal(accessLogLevel('/api/health', 200), 'debug')
    assert.equal(accessLogLevel('/_next/static/a.js', 200), 'debug')
    assert.equal(accessLogLevel('/api/health', 503), 'error')
  })

  it('linha humana e JSON no formato-alvo', () => {
    logAccess({ method: 'GET', route: '/api/items', status: 200, latencyMs: 12, requestId: '3b53d8d9' })
    logAccess({ method: 'POST', route: '/api/items', status: 409, latencyMs: 23, requestId: '5e1a8bc2' })
    assert.deepEqual(out, ['INF 14:41:04 GET /api/items 200 12ms req=3b53d8d9'])
    assert.deepEqual(err, ['WRN 14:41:04 POST /api/items 409 23ms req=5e1a8bc2'])
    capture({ format: 'json' })
    logAccess({ method: 'GET', route: '/api/items', status: 200, latencyMs: 12, requestId: '3b53d8d9' })
    const rec = JSON.parse(out[0])
    assert.deepEqual(
      { msg: rec.msg, event: rec.event, req: rec.req, route: rec.route, status: rec.status, latencyMs: rec.latencyMs },
      { msg: 'GET /api/items 200 12ms req=3b53d8d9', event: 'http.request', req: '3b53d8d9', route: '/api/items', status: 200, latencyMs: 12 }
    )
  })

  describe('integração com http.Server', () => {
    let server: http.Server
    after(() => server?.close())

    it('registra a requisição, devolve X-Request-ID e correlaciona logs internos', async () => {
      installAccessLog()
      server = http.createServer((req, res) => {
        createLogger('api').warn('inside.handler')
        res.statusCode = req.url?.startsWith('/fail') ? 500 : 201
        res.end('ok')
      })
      await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
      const { port } = server.address() as { port: number }

      const ok = await fetch(`http://127.0.0.1:${port}/api/items?secret=1`, { headers: { 'X-Request-ID': 'client-req-0001' } })
      assert.equal(ok.headers.get('x-request-id'), 'client-req-0001')
      const fail = await fetch(`http://127.0.0.1:${port}/fail`, { headers: { 'X-Request-ID': 'bad\tvalue' } })
      const generated = fail.headers.get('x-request-id')!
      assert.match(generated, /^[0-9a-f]{12}$/)
      await new Promise((r) => setTimeout(r, 20))

      assert.ok(out.some((l) => /^INF 14:41:04 GET \/api\/items 201 \d+ms req=client-req-0001$/.test(l)), out.join('\n'))
      assert.ok(!out.join('\n').includes('secret'))
      assert.ok(err.some((l) => l === 'WRN 14:41:04 [api] inside.handler req=client-req-0001'))
      assert.ok(err.some((l) => new RegExp(`^ERR 14:41:04 GET /fail 500 \\d+ms req=${generated}$`).test(l)))
    })
  })
})

describe('console legado', () => {
  it('extrai contexto, campos e erro', () => {
    const e = new Error('x')
    const parsed = parseConsoleArgs(['[webhooks] delivery failed', { status: 500 }, e])
    assert.equal(parsed.context, 'webhooks')
    assert.equal(parsed.msg, 'delivery failed')
    assert.equal(parsed.fields.status, 500)
    assert.equal(parsed.fields.err, e)
    assert.equal(parseConsoleArgs(['Error updating user:', e]).msg, 'Error updating user')
    assert.equal(parseConsoleArgs(['%s=%d', 'a', 1]).msg, 'a=1')
  })

  it('prisma:error vira ERR com só a causa (sem a chamada com os dados)', () => {
    const parsed = parseConsoleArgs([
      'prisma:error \nInvalid `prisma.user.update()` invocation:\n\n{ data: { email: "ana@x.com" } }\n\nCan\'t reach database server at `db:5432`',
    ])
    assert.equal(parsed.level, 'error')
    assert.equal(parsed.context, 'prisma')
    assert.equal(parsed.msg, "Can't reach database server at `db:5432`")
  })
})
