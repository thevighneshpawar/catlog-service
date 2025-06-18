import { config } from 'dotenv'

config()

const {
    PORT,
    NODE_ENV,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_SSL,
} = process.env

export const Config = {
    PORT,
    NODE_ENV,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_SSL,
}
