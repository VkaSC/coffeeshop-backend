import Utils from '../utils/core.utils';

export default class Order {
    id;
    device;
    date;
    userId;
    total;
    lines;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.device = obj.device;
            this.date = obj.date;
            this.userId = obj.userId;
            this.total = obj.total;
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
            'date',
            'userId',
            `total`,
        ];
    }

    toSQL(){
        const data = Utils.clone(this);
        delete data.lines;
        return data;
    }
}