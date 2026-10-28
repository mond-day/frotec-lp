import { AsyncLocalStorage } from 'async_hooks'
import { hostname } from 'os'
import { BRAND_NAME, SONDER_ASCII_LOGO } from './brand'
import { errorInfo, sanitizeFields, sanitizeText, toSingleLine } from './sanitize'

/**
 * Logger operacional (padrão global de logs Sonder Corp).
 *
 * - Humano compacto por padrão: `INF 14:41:04 [contexto] mensagem chave=valor`.
 * - LOG_FORMAT=json: uma linha JSON por evento, `time` ISO 8601 UTC, sem banner.
 * - LOG_LEVEL=debug|info|warn|error (padrão info). ERROR nunca é filtrado.
 * - INFO/DEBUG em stdout, WARN/ERROR em stderr.
 * - Escreve direto no stdout/stderr: `compiler.removeConsole` não o afeta.
 *
 * Auditoria persistida (quando houver) continua separada; isto é só console.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type LogFields = Record<string, unknown>
type Env = Record<string, string | undefined>

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 }
const LEVEL_SHORT: Record<LogLevel, string> = { debug: 'DBG', info: 'INF', warn: 'WRN', error: 'ERR' }
const LEVEL_LONG: Record<LogLevel, string> = { debug: 'DEBUG', info: 'INFO', warn: 'WARN', error: 'ERROR' }
const RESERVED_JSON_KEYS = new Set(['time', 'level', 'msg', 'context'])

export interface LoggerOptions {
  format: 'human' | 'json'
  level: LogLevel
  timeZone: string
  banner: boolean
  stdout: (line: string) => void
  stderr: (line: string) => void
  now: () => Date
}

function writeStream(stream: 'stdout' | 'stderr') {
  return (line: string) => {
    const target = typeof process !== 'undefined' ? process[stream] : undefined
    if (target?.write) target.write(line + '\n')
  }
}

function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/** Fuso efetivo do serviço: LOG_TIMEZONE > TZ > fuso do runtime. Não impõe fuso de negócio. */
export function effectiveTimeZone(env: Env = process.env): string {
  for (const candidate of [env.LOG_TIMEZONE, env.TZ]) {
    const tz = candidate?.trim().replace(/^:/, '')
    if (tz && isValidTimeZone(tz)) return tz
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export function optionsFromEnv(env: Env = process.env): LoggerOptions {
  const level = (env.LOG_LEVEL || '').trim().toLowerCase()
  return {
    format: (env.LOG_FORMAT || '').trim().toLowerCase() === 'json' ? 'json' : 'human',
    level: level in LEVEL_ORDER ? (level as LogLevel) : 'info',
    timeZone: effectiveTimeZone(env),
    banner: !['false', '0', 'off'].includes((env.LOG_BANNER || '').trim().toLowerCase()),
    stdout: writeStream('stdout'),
    stderr: writeStream('stderr'),
    now: () => new Date(),
  }
}

type LoggerState = {
  options?: LoggerOptions
  timeFormat?: { tz: string; fmt: Intl.DateTimeFormat }
  processStarted?: boolean
  requestContext?: AsyncLocalStorage<RequestContext>
}

// Estado no globalThis: o Next pode carregar o módulo em mais de um bundle no mesmo processo
const state: LoggerState = ((globalThis as { __sonderLogger?: LoggerState }).__sonderLogger ??= {})

function options(): LoggerOptions {
  return (state.options ??= optionsFromEnv())
}

/** Ajusta o logger (testes e boot). Campos omitidos vêm do ambiente. */
export function configureLogger(overrides: Partial<LoggerOptions> = {}): LoggerOptions {
  state.options = { ...optionsFromEnv(), ...overrides }
  state.timeFormat = undefined
  return state.options
}

export function resetLoggerForTests() {
  state.options = undefined
  state.timeFormat = undefined
  state.processStarted = false
}

// ---- Correlação por requisição ------------------------------------------------------------

export interface RequestContext {
  requestId: string
}

function requestStorage() {
  return (state.requestContext ??= new AsyncLocalStorage<RequestContext>())
}

export function runWithRequestContext<T>(ctx: RequestContext, fn: () => T): T {
  return requestStorage().run(ctx, fn)
}

export function currentRequestId(): string | undefined {
  return requestStorage().getStore()?.requestId
}

// ---- Formatação --------------------------------------------------------------------------

export function formatClock(date: Date, timeZone: string): string {
  if (!state.timeFormat || state.timeFormat.tz !== timeZone) {
    state.timeFormat = {
      tz: timeZone,
      fmt: new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
    }
  }
  return state.timeFormat.fmt.format(date)
}

function humanValue(value: unknown): string {
  if (value === null || value === undefined) return String(value)
  if (typeof value === 'string') {
    return value !== '' && /^[^\s"=]+$/.test(value) ? toSingleLine(value) : JSON.stringify(value)
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return '"[unprintable]"'
  }
}

export interface LogEntry {
  level: LogLevel
  msg: string
  context?: string
  event?: string
  fields?: LogFields
  /** Campos já contidos na mensagem humana (ex.: access log): só vão para o JSON. */
  humanFields?: boolean
}

function prepare(entry: LogEntry) {
  const raw = { ...(entry.fields || {}) }
  const err = raw.err
  delete raw.err
  const fields = sanitizeFields(raw)
  const requestId = currentRequestId()
  if (requestId && fields.req === undefined) fields.req = requestId
  return { fields, error: err === undefined ? undefined : errorInfo(err) }
}

export function formatHuman(entry: LogEntry, opts: LoggerOptions): string {
  const { fields, error } = prepare(entry)
  let line = `${LEVEL_SHORT[entry.level]} ${formatClock(opts.now(), opts.timeZone)}`
  if (entry.context) line += ` [${toSingleLine(sanitizeText(entry.context, 40))}]`
  const msg = toSingleLine(sanitizeText(entry.msg))
  if (msg) line += ` ${msg}`
  if (entry.humanFields !== false) {
    for (const [key, value] of Object.entries(fields)) line += ` ${key}=${humanValue(value)}`
  }
  if (error) {
    line += ` err=${humanValue(`${error.name}: ${error.message}`)}`
    if (error.code) line += ` code=${humanValue(error.code)}`
    if (error.cause) line += ` cause=${humanValue(error.cause)}`
    // Stack só em ERROR, em linhas indentadas logo abaixo do evento
    if (entry.level === 'error' && error.stack) {
      line += error.stack.map((frame) => `\n    ${toSingleLine(frame)}`).join('')
    }
  }
  return line
}

export function formatJson(entry: LogEntry, opts: LoggerOptions): string {
  const { fields, error } = prepare(entry)
  const record: Record<string, unknown> = {
    time: opts.now().toISOString(),
    level: LEVEL_LONG[entry.level],
    msg: sanitizeText(entry.msg),
  }
  if (entry.context) record.context = sanitizeText(entry.context, 40)
  if (entry.event && entry.event !== entry.msg) record.event = entry.event
  for (const [key, value] of Object.entries(fields)) {
    record[RESERVED_JSON_KEYS.has(key) ? `field_${key}` : key] = value
  }
  if (error) record.err = error
  return JSON.stringify(record)
}

export function writeLog(entry: LogEntry, force = false) {
  try {
    const opts = options()
    if (!force && entry.level !== 'error' && LEVEL_ORDER[entry.level] < LEVEL_ORDER[opts.level]) return
    const line = opts.format === 'json' ? formatJson(entry, opts) : formatHuman(entry, opts)
    if (entry.level === 'warn' || entry.level === 'error') opts.stderr(line)
    else opts.stdout(line)
  } catch {
    // Log nunca derruba a aplicação
    try {
      writeStream('stderr')('ERR logger.write_failed')
    } catch {
      /* sem saída disponível */
    }
  }
}

// ---- API ---------------------------------------------------------------------------------

export interface Logger {
  debug(msg: string, fields?: LogFields): void
  info(msg: string, fields?: LogFields): void
  warn(msg: string, fields?: LogFields): void
  error(msg: string, fields?: LogFields): void
  child(context: string): Logger
}

/**
 * `msg` deve ser um nome de evento estável (`dominio.acao.resultado`); detalhes vão em `fields`.
 * Exceções: passe em `fields.err` (stack tratada, sem dados sensíveis).
 */
export function createLogger(context?: string): Logger {
  const at = (level: LogLevel) => (msg: string, fields?: LogFields) => writeLog({ level, msg, context, fields })
  return {
    debug: at('debug'),
    info: at('info'),
    warn: at('warn'),
    error: at('error'),
    child: (sub) => createLogger(context ? `${context}.${sub}` : sub),
  }
}

export const logger = createLogger()

// ---- Boot ---------------------------------------------------------------------------------

export interface ProcessMetadata {
  service: string
  environment: string
  version: string
  sha?: string
  tz: string
  instance: string
  node: string
}

export function processMetadata(env: Env = process.env): ProcessMetadata {
  const sha = (env.GIT_SHA || env.SOURCE_COMMIT || '').trim()
  return {
    service: env.SERVICE_NAME?.trim() || 'frotec-lp',
    environment: env.APP_ENV?.trim() || env.NODE_ENV || 'development',
    version: env.APP_VERSION?.trim() || env.npm_package_version || 'unknown',
    ...(/^[0-9a-f]{7,40}$/i.test(sha) ? { sha: sha.slice(0, 12) } : {}),
    tz: options().timeZone,
    instance: hostname(),
    node: process.version,
  }
}

/**
 * Cabeçalho do processo, uma única vez: arte do S + metadados (humano) ou
 * um evento `service.started` (JSON). Indica apenas que o processo iniciou, não que o deploy foi validado.
 */
export function logProcessStart(): boolean {
  if (state.processStarted) return false
  state.processStarted = true
  const opts = options()
  const meta = processMetadata()
  if (opts.format === 'json') {
    writeLog({ level: 'info', msg: 'service.started', context: 'boot', fields: { brand: BRAND_NAME, ...meta } }, true)
    return true
  }
  if (opts.banner) opts.stdout(SONDER_ASCII_LOGO)
  writeLog({ level: 'info', msg: 'service.started', context: 'boot', fields: { ...meta } }, true)
  return true
}
