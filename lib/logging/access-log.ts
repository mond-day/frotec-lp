import http from 'http'
import { randomBytes } from 'crypto'
import { performance } from 'perf_hooks'
import { runWithRequestContext, writeLog, type LogLevel } from './logger'
import { sanitizeText, toSingleLine } from './sanitize'

/**
 * Access log HTTP + correlação por `X-Request-ID`.
 *
 * O Next não expõe hook de resposta; o evento `request` do http.Server é interceptado uma vez,
 * no boot (instrumentation.ts). Cada requisição ganha um id (propagado se válido), devolvido em
 * `X-Request-ID` e disponível para os logs emitidos durante ela (AsyncLocalStorage).
 */

export const REQUEST_ID_HEADER = 'x-request-id'
const VALID_REQUEST_ID = /^[A-Za-z0-9._:-]{8,64}$/

// Sucessos repetitivos (healthcheck do Swarm, assets estáticos) vão para DEBUG; falhas continuam visíveis
const QUIET_ROUTES = new Set(['/api/health', '/api/ready', '/favicon.ico'])
const QUIET_PREFIXES = ['/_next/']

export function resolveRequestId(incoming: unknown): string {
  const value = Array.isArray(incoming) ? incoming[0] : incoming
  if (typeof value === 'string' && VALID_REQUEST_ID.test(value)) return value
  return randomBytes(6).toString('hex')
}

/** Só o caminho: query string pode carregar tokens (reset de senha, assinaturas). */
export function routeFromUrl(url: string | undefined): string {
  const path = (url || '/').split(/[?#]/)[0] || '/'
  return toSingleLine(sanitizeText(path, 200))
}

export function accessLogLevel(route: string, status: number): LogLevel {
  if (status >= 500) return 'error'
  if (status >= 400) return 'warn'
  if (QUIET_ROUTES.has(route) || QUIET_PREFIXES.some((p) => route.startsWith(p))) return 'debug'
  return 'info'
}

export interface AccessRecord {
  method: string
  route: string
  status: number
  latencyMs: number
  requestId: string
  aborted?: boolean
}

export function logAccess(record: AccessRecord) {
  const method = toSingleLine(sanitizeText(record.method, 16))
  let msg = `${method} ${record.route} ${record.status} ${record.latencyMs}ms req=${record.requestId}`
  if (record.aborted) msg += ' aborted=true'
  writeLog({
    level: accessLogLevel(record.route, record.status),
    msg,
    event: 'http.request',
    humanFields: false,
    fields: {
      req: record.requestId,
      method,
      route: record.route,
      status: record.status,
      latencyMs: record.latencyMs,
      ...(record.aborted ? { aborted: true } : {}),
    },
  })
}

function track(req: http.IncomingMessage, res: http.ServerResponse, requestId: string) {
  const startedAt = performance.now()
  res.once('close', () => {
    logAccess({
      method: req.method || 'GET',
      route: routeFromUrl(req.url),
      status: res.statusCode,
      latencyMs: Math.round(performance.now() - startedAt),
      requestId,
      aborted: !res.writableFinished,
    })
  })
}

type AccessLogGlobal = typeof globalThis & { __sonderAccessLogInstalled?: boolean }

export function installAccessLog(): boolean {
  const g = globalThis as AccessLogGlobal
  if (g.__sonderAccessLogInstalled) return false
  g.__sonderAccessLogInstalled = true

  const proto = http.Server.prototype as unknown as { emit: (event: string | symbol, ...args: unknown[]) => boolean }
  const originalEmit = proto.emit
  proto.emit = function (this: http.Server, event: string | symbol, ...args: unknown[]) {
    if (event !== 'request') return originalEmit.call(this, event, ...args)
    const [req, res] = args as [http.IncomingMessage, http.ServerResponse]
    let requestId: string
    try {
      requestId = resolveRequestId(req.headers[REQUEST_ID_HEADER])
      // Rotas do app leem o mesmo id via headers()
      req.headers[REQUEST_ID_HEADER] = requestId
      res.setHeader('X-Request-ID', requestId)
      track(req, res, requestId)
    } catch {
      return originalEmit.call(this, event, ...args)
    }
    return runWithRequestContext({ requestId }, () => originalEmit.call(this, event, ...args))
  }
  return true
}
