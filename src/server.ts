import { Config } from './Config'
import app from './app'
import logger from './Config/logger'
import { AppDataSource } from './Config/data-source'

const startServer = async () => {
    const PORT = Config.PORT
    try {
        await AppDataSource.initialize()
        logger.info('Database connection has been established')
        app.listen(PORT, () => {
            logger.info('Listening on port ', { port: PORT })
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

void startServer()
