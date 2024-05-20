module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'luxury_watches',
        user: process.env.DB_USER || 'titouan',
        password: process.env.DB_PASS || 'azerty78',
        options: {
            dialect: process.env.DIALECT || 'mysql',
            host: process.env.HOST || 'localhost'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
      }
}