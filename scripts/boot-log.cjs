'use strict'

/**
 * Formato mínimo do padrão Sonder Corp para o que roda antes do logger do app (lib/logging):
 * o wrapper scripts/start-server.js e as linhas de abertura do Next (via next-console-preload.cjs).
 *
 * Humano: `INF HH:mm:ss [contexto] mensagem chave=valor`; LOG_FORMAT=json: uma linha JSON.
 * Sem banner aqui: a arte do S é impressa uma vez pelo processo do app (instrumentation.ts).
 */

const { format } = require('util')

const LEVELS = { info: ['INF', 'INFO'], warn: ['WRN', 'WARN'], error: ['ERR', 'ERROR'] }
const isJson = () => (process.env.LOG_FORMAT || '').trim().toLowerCase() === 'json'

let clockFormat
function clock(date) {
  if (!clockFormat) {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }
    for (const tz of [process.env.LOG_TIMEZONE, process.env.TZ, undefined]) {
      try {
        clockFormat = new Intl.DateTimeFormat('en-GB', { ...options, timeZone: tz ? tz.replace(/^:/, '') : undefined })
        break
      } catch {
        // fuso inválido: tenta o próximo
      }
    }
  }
  return clockFormat.format(date)
}

function clean(text) {
  return String(text)
    .replace(/\u001b\[[0-9;]*[A-Za-z]/g, '')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 1000)
}

function humanValue(value) {
  const text = clean(value)
  return text && /^[^\s"=]+$/.test(text) ? text : JSON.stringify(text)
}

function bootLog(level, context, msg, fields = {}) {
  try {
    const now = new Date()
    const [short, long] = LEVELS[level] || LEVELS.info
    const line = isJson()
      ? JSON.stringify({ time: now.toISOString(), level: long, msg: clean(msg), context, ...fields })
      : `${short} ${clock(now)} [${context}] ${clean(msg)}` +
        Object.entries(fields).map(([k, v]) => ` ${k}=${humanValue(v)}`).join('')
    ;(level === 'info' ? process.stdout : process.stderr).write(line + '\n')
  } catch {
    // log nunca derruba o boot
  }
}

/** Padroniza console.* deste processo (sobrescrito depois pelo logger completo do app). */
function routeConsole(context) {
  const map = { log: 'info', info: 'info', debug: 'info', warn: 'warn', error: 'error' }
  for (const [method, level] of Object.entries(map)) {
    console[method] = (...args) => {
      const text = args.map((a) => (a instanceof Error ? `${a.name}: ${a.message}` : typeof a === 'string' ? a : format(a))).join(' ')
      if (clean(text)) bootLog(level, context, text)
    }
  }
}

module.exports = { bootLog, routeConsole }
