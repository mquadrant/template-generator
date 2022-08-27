import Express, { NextFunction, Request, Response } from 'express'

const expressRouter = Express.Router()

expressRouter.get(
    '/',
    function (_req: Request, res: Response, _next: NextFunction) {
        res.send({ title: 'Express' })
    }
)

export default expressRouter
