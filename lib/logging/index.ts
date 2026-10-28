import { installAccessLog } from './access-log'
import { routeConsoleToLogger } from './console'
import { logProcessStart } from './logger'

export { createLogger, logger, currentRequestId, type Logger, type LogFields, type LogLevel } from './logger'

/** Boot do processo Node (instrumentation.ts): cabeçalho único, console padronizado e access log. */
export function startLogging() {
  logProcessStart()
  routeConsoleToLogger()
  installAccessLog()
}
