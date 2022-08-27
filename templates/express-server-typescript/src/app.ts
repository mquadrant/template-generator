import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import env from '../config/default'

import rootRouter from './routes/index'

const app = express()
const apiPrefix = `${env.api.prefix}`

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.enable('trust proxy')

// REST route
app.use(apiPrefix, rootRouter)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
    next(createError(404))
})

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.send({
        success: false,
        message: err.message,
        stack: err.stack,
    })
})

export default app
