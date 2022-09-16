import { config } from "dotenv";

config();

export default{
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD || "",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtAppSecret: process.env.JWT_APP_SECRET || "",
    tokenExpiration: process.env.TOKEN_EXPIRATION || "",
};