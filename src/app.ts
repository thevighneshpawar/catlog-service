import express, { Request, Response, NextFunction } from 'express'
import logger from './Config/logger'
import { HttpError } from 'http-errors'

const app = express()

app.get('/', (req, res) => {
    res.send('Welcome to Catlog service')
    // for async functions it not handle  using throw err
    // for that we use next
    // normally we use next() to give control to next function \
    // but if we use next(args) then it considered as error and passed to global handleer
})

//global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    })
})

export default app
