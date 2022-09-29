import Utils from '../utils/core.utils';

export default class OrderLine {
    id;
    productId;
    product;
    requestId;
    quantity;
    total;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.productId = obj.productId;
            this.product = obj.product;
            this.requestId = obj.requestId;
            this.quantity = obj.quantity;
            this.total = obj.total;

        }
    }

    static table(){
        return 'request_line'
    }

    static visibleFields(){
        return [
            'id',
            'productId',
            'requestId',
            'quantity',
            'total',

        ];
    }

    toSQL(){
        const data = Utils.clone(this);
        delete data.product;
        return data;
    }
}