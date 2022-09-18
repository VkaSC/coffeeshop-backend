import Utils from "../utils/core.utils";

export default class ProductAllergen {

    id;
    productId;
    alergenId;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.productId = obj.productId;
            this.alergenId = obj.alergenId;            
        }
    }

    static table() {
        return`productAllergen`
    }

    static vissibleFields() {
        return [
            `id`,
            `productId`,
            `alergenId`
        ]
    }
}