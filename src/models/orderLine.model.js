import Utils from '../utils/core.utils';

export default class OrderLine {
    id;
    productId;
    requestId;
    quantity;
    total;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.productId = obj.productId;
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
}