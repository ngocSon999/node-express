require('dotenv').config();
module.exports = {
    username: process.env.SQLUSER_ENV,
    password: process.env.SQLPASS_ENV,
    database: process.env.SQLDATABASE_ENV,
    waitForConnections: true,
    host: process.env.SQLDATABASE_HOST_ENV,
    port: Number(process.env.SQLDATABASE_PORT_ENV) || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: false,
        charset: 'utf8mb4',
    },
};
