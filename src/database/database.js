import { createConnection } from "promise-mysql";
import config from "./../config";

let instance;
let connection;

export default class Database {

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