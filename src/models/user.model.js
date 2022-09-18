import Utils from "../utils/core.utils";

export default class User{

    id;
    name;
    lastName;
    type;
    email;
    password;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.name = obj.name;
            this.lastName = obj.lastName;
            this.type = obj.type;
            this.email = obj.email;
            this.password = obj.password;
        }
    }

    static table() {
        return `user`
    }

    static visibleFields() {
        return [
            `id`,
            `name`,
            `lastname`,
            `type`,
            `email`,
        ]
    }
}