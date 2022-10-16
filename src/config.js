const {config} = require("dotenv");

config();

module.exports = {
    host: process.env.HOST || "",
    isProduction: process.env.MODE === 'PROD' || false,
    database: process.env.DATABASE || "",
    port: process.env.PORT || 0,
    user: process.env.DB_USER || "",
    password: process.env.PASSWORD || "",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtAppSecret: process.env.JWT_APP_SECRET || "",
    tokenExpiration: process.env.TOKEN_EXPIRATION || "",
    emailService: process.env.EMAIL_SERVICE || "",
    email: process.env.EMAIL || "",
    emailPassword: process.env.EMAIL_PASSWORD || "",
    frontHost: process.env.FRONT_HOST || "",
};