const Utils = require("../utils/core.utils");

class User{

    id;
    name;
    lastName;
    type;
    email;
    active;
    password;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.name = obj.name;
            this.lastName = obj.lastName;
            this.type = obj.type;
            this.email = obj.email;
            this.active = obj.active;
            this.password = obj.password;
        }
    }

    static table() {
        return 'user'
    }

    static visibleFields() {
        return [
            'id',
            'name',
            'lastName',
            'type',
            'active',
            'email',
        ]
    }

    toObject(){
        return Utils.clone(this);
    }

    toSQL(cleanPass){
        const obj = Utils.clone(this);
        if(cleanPass){
            delete obj.password;
        }
        return obj;
    }
}
module.exports = User;