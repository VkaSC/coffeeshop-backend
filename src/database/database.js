const { createConnection, createPool } = require("promise-mysql");
const config = require("./../config");

let instance;
let sqlPool;

class Database {

    constructor() {

    }

    query(query, params) {
        return sqlPool ? sqlPool.query(query, params) : undefined;
    }

    async open() {
        if(!sqlPool){
            sqlPool = await createPool({
                connectionLimit: 100,
                host: config.host,
                database: config.database,
                user: config.user,
                password: config.password
            });
        }
    }

    async release() {
        if (sqlPool) {
            await sqlPool.getConnection().release();
        }
    }

    async close() {
        if (sqlPool) {
            await sqlPool.getConnection().release();
            sqlPool = undefined;
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new Database();
        }
        return instance;
    }

}
module.exports = Database;