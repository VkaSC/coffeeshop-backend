const Utils = require("../utils/core.utils");

class Token {

    id;
    token;
    userId;
    active;
    remember;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.token = obj.token;
            this.userId = obj.userId;
            this.active = obj.active;
            this.remember = obj.remember;
        }
    }

    static table() {
        return 'auth'
    }

    static visibleFields() {
        return [
            'id',
            'token',
            'userId',
            'active',
            'remember',
        ]
    }
}
module.exports = Token;