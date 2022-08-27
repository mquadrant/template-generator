#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debug from 'debug'
import http from 'http'
import config from 'config'
import app from '../server/src/app'
import log from '../server/src/logger'

debug('Sync-Party:server')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.get('port') || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const portVal = parseInt(val, 10)

    if (Number.isNaN(portVal)) {
        // named pipe
        return val
    }

    if (portVal >= 0) {
        // port number
        return portVal
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: string | number }) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            log.error({}, `${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            log.error({}, `${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address() || 'no port'
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    log.info({}, `Server listening on ${bind}`)
    debug(`Listening on ${bind}`)
}
