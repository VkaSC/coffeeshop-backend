import Utils from "../utils/core.utils";

export default class ProductAllergen {

    id;
    productId;
    allergenId;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.productId = obj.productId;
            this.allergenId = obj.allergenId;            
        }
    }

    static table() {
        return'product_allergens'
    }

    static visibleFields() {
        return [
            'id',
            'productId',
            'allergenId'
        ]
    }
}