import { format } from 'util'
import { writeLog, type LogFields, type LogLevel } from './logger'

/**
 * Encaminha console.* (código legado do app e logs do próprio Next) para o logger:
 * uma linha por evento, sanitizada, com stack tratada e `req` quando dentro de uma requisição.
 */

const CONSOLE_LEVELS: Array<[keyof Console, LogLevel]> = [
  ['debug', 'debug'],
  ['log', 'info'],
  ['info', 'info'],
  ['warn', 'warn'],
  ['error', 'error'],
]

export interface ParsedConsoleArgs {
  msg: string
  context?: string
  fields: LogFields
  /** Nível vindo da própria mensagem (ex.: `prisma:error`), quando houver */
  level?: LogLevel
}

const PRISMA_LEVELS: Record<string, LogLevel> = { error: 'error', warn: 'warn', info: 'info', query: 'debug' }

/** `console.error('[webhooks] delivery failed', { status }, err)` -> contexto, mensagem e campos. */
export function parseConsoleArgs(args: unknown[]): ParsedConsoleArgs {
  const fields: LogFields = {}
  let parts: string[] = []

  if (typeof args[0] === 'string' && /%[sdifjoOc]/.test(args[0]) && args.length > 1) {
    parts = [format(...(args as [string, ...unknown[]]))]
  } else {
    for (const arg of args) {
      if (arg instanceof Error) {
        if (fields.err === undefined) fields.err = arg
        else parts.push(`${arg.name}: ${arg.message}`)
      } else if (arg !== null && typeof arg === 'object' && !Array.isArray(arg)) {
        Object.assign(fields, arg)
      } else if (typeof arg === 'string') {
        parts.push(arg)
      } else {
        parts.push(format(arg))
      }
    }
  }

  let msg = parts.join(' ').trim()
  // Prisma loga `prisma:error <Invalid prisma.x() invocation: {args}> <causa>`: fica só a causa, sem os dados
  const prisma = msg.match(/^prisma:(error|warn|info|query)\s*/)
  if (prisma) {
    const lines = msg.slice(prisma[0].length).split('\n').map((l) => l.trim()).filter(Boolean)
    return { msg: lines[lines.length - 1] || 'prisma', context: 'prisma', fields, level: PRISMA_LEVELS[prisma[1]] }
  }
  let context: string | undefined
  const prefix = msg.match(/^\[([\w.-]{1,40})\]\s*/)
  if (prefix) {
    context = prefix[1]
    msg = msg.slice(prefix[0].length)
  }
  return { msg: msg.replace(/:\s*$/, ''), context, fields }
}

type ConsoleGlobal = typeof globalThis & { __sonderConsoleRouted?: boolean }

export function routeConsoleToLogger(): boolean {
  const g = globalThis as ConsoleGlobal
  if (g.__sonderConsoleRouted) return false
  g.__sonderConsoleRouted = true
  for (const [method, level] of CONSOLE_LEVELS) {
    ;(console as unknown as Record<string, unknown>)[method] = (...args: unknown[]) => {
      const parsed = parseConsoleArgs(args)
      writeLog({ level: parsed.level || level, msg: parsed.msg, context: parsed.context, event: 'console', fields: parsed.fields })
    }
  }
  return true
}
