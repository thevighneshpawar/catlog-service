import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Config } from '.'

// console.log('DB Config:', {
//     host: Config.DB_HOST,
//     port: Config.DB_PORT,
//     username: Config.DB_USERNAME,
//     password: Config.DB_PASSWORD, // Check if this is undefined
//     database: Config.DB_NAME,
// })

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //make it false in production always keep false
    synchronize: false,
    logging: false,
    entities: ['src/entity/**/*.{ts,js}'], //[User, RefreshToken, Tenant],
    migrations: ['src/migration/**/*.{ts,js}'],
    subscribers: [],
    ssl: Config.DB_SSL === 'true',
})
