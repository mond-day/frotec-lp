'use strict'

// `node -r ./scripts/next-console-preload.cjs server.js`: as linhas de abertura do Next
// (impressas antes do instrumentation.ts) já saem no padrão, inclusive em LOG_FORMAT=json.
require('./boot-log.cjs').routeConsole('next')
