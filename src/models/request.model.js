import Utils from '../utils/core.utils';

export default class Request {
    id;
    device;
    date;
    userId;
    lines;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.device = obj.device;
            this.date = obj.date;
            this.userId = obj.userId;
            this.lines = obj.lines;
        }
    }

    static table(){
        return 'request'
    }

    static visibleFields(){
        return [
            'id',
            'device',
            'day',
            'hour',
            'userId',
        ];
    }

    toSQL(){
        const data = Utils.clone(this);
        delete data.lines;
        return data;
    }
}