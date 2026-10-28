/**
 * Sanitização de tudo que vai para os logs: nunca lança, mascara credenciais e PII,
 * limita tamanho/profundidade e remove códigos ANSI.
 */

const MAX_STRING = 1000
const MAX_DEPTH = 4
const MAX_KEYS = 30
const MAX_ARRAY = 20
const MAX_STACK_FRAMES = 10

const SENSITIVE_KEY = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|session|signature|credential|hash/i

const ANSI = /\u001b\[[0-9;]*[A-Za-z]/g
const EMAIL = /([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

export const REDACTED = '[redacted]'

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY.test(key)
}

/** Mascara credenciais, e-mails e query strings de URLs em texto livre. */
export function sanitizeText(input: unknown, max = MAX_STRING): string {
  let text: string
  try {
    text = typeof input === 'string' ? input : String(input)
  } catch {
    return '[unprintable]'
  }
  text = text
    .replace(ANSI, '')
    .replace(/\bBearer\s+[^\s"',]+/gi, `Bearer ${REDACTED}`)
    .replace(/\bsk_[A-Za-z0-9_-]{6,}/g, `sk_${REDACTED}`)
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, '[jwt]')
    .replace(/(https?:\/\/[^\s?#"'<>]+)\?[^\s#"'<>]*/gi, `$1?${REDACTED}`)
    .replace(
      /\b((?:pass(?:word)?|secret|token|api[-_]?key|session(?:_id)?)\s*[=:]\s*)("[^"]*"|[^\s,;&"]+)/gi,
      `$1${REDACTED}`
    )
    .replace(EMAIL, '$1***@$2')
  if (text.length > max) {
    text = `${text.slice(0, max)}...[truncated ${text.length - max}]`
  }
  return text
}

/** Uma linha só: quebras viram `\n` literal (evita injeção de linhas falsas no log). */
export function toSingleLine(text: string): string {
  return text
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/\t/g, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, '')
}

export interface ErrorInfo {
  name: string
  message: string
  code?: string
  stack?: string[]
  cause?: string
}

export function errorInfo(error: unknown): ErrorInfo {
  try {
    if (!(error instanceof Error)) {
      return { name: 'NonError', message: sanitizeText(safeString(error), 300) }
    }
    let message = error.message || ''
    // Erros do Prisma trazem a chamada inteira (com os dados) antes da causa: fica só a última linha
    if (error.name.startsWith('PrismaClient')) {
      const lines = message.split('\n').map((l) => l.trim()).filter(Boolean)
      message = lines[lines.length - 1] || error.name
    }
    const info: ErrorInfo = { name: error.name, message: sanitizeText(message, 500) }
    const code = (error as { code?: unknown }).code
    if (typeof code === 'string' || typeof code === 'number') info.code = String(code)
    const frames = (error.stack || '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('at '))
      .slice(0, MAX_STACK_FRAMES)
      .map((l) => sanitizeText(l, 300))
    if (frames.length) info.stack = frames
    const cause = (error as { cause?: unknown }).cause
    if (cause instanceof Error) info.cause = `${cause.name}: ${sanitizeText(cause.message, 300)}`
    return info
  } catch {
    return { name: 'Error', message: '[unreadable error]' }
  }
}

function safeString(value: unknown): string {
  try {
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  } catch {
    return '[unprintable]'
  }
}

/** Cópia segura de um valor estruturado (recursiva, limitada, sem ciclos). */
export function sanitizeValue(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  try {
    if (value === null || value === undefined) return value
    switch (typeof value) {
      case 'string':
        return sanitizeText(value)
      case 'number':
        return Number.isFinite(value) ? value : String(value)
      case 'boolean':
        return value
      case 'bigint':
        return value.toString()
      case 'function':
      case 'symbol':
        return undefined
    }
    if (value instanceof Error) return errorInfo(value)
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()
    if (value instanceof URL) return sanitizeText(value.href)
    if (ArrayBuffer.isView(value)) return `[binary ${value.byteLength} bytes]`
    const obj = value as object
    if (seen.has(obj)) return '[circular]'
    if (depth >= MAX_DEPTH) return Array.isArray(obj) ? '[array]' : '[object]'
    seen.add(obj)
    if (Array.isArray(obj)) {
      const items = obj.slice(0, MAX_ARRAY).map((item) => sanitizeValue(item, depth + 1, seen))
      if (obj.length > MAX_ARRAY) items.push(`[+${obj.length - MAX_ARRAY} more]`)
      return items
    }
    return sanitizeFields(obj as Record<string, unknown>, depth, seen)
  } catch {
    return '[unreadable]'
  }
}

export function sanitizeFields(
  fields: Record<string, unknown>,
  depth = 0,
  seen = new WeakSet<object>()
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  let keys: string[]
  try {
    keys = Object.keys(fields)
  } catch {
    return { fields: '[unreadable]' }
  }
  for (const key of keys.slice(0, MAX_KEYS)) {
    try {
      if (isSensitiveKey(key)) {
        out[key] = REDACTED
        continue
      }
      const clean = sanitizeValue(fields[key], depth + 1, seen)
      if (clean !== undefined) out[key] = clean
    } catch {
      out[key] = '[unreadable]'
    }
  }
  if (keys.length > MAX_KEYS) out._truncatedKeys = keys.length - MAX_KEYS
  return out
}
