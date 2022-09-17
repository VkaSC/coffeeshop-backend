import Utils from '../utils/core.utils';

export default class RequestLine {
    id;
    productId;
    requestId;
    quantity;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.productId = obj.productId;
            this.requestId = obj.requestId;
            this.quantity = obj.quantity;
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
        ];
    }
}