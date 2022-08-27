import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export default {
    env: process.env.NODE_ENV,
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT!, 10),
    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
}
