const { createConnection } = require("promise-mysql");
const config = require("./../config");

let instance;
let connection;

class Database {

    constructor() {

    }

    query(query, params) {
        return connection ? connection.query(query, params) : undefined;
    }

    async open() {
        if (!connection) {
            connection = await createConnection({
                host: config.host,
                database: config.database,
                user: config.user,
                password: config.password
            });
        }
    }

    close() {
        if (connection) {
            connection.end();
            connection = undefined;
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