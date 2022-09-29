import Utils from '../utils/core.utils';

export default class Product {
    id;
    name;
    type;
    category;
    details;
    price;
    allergens;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.name = obj.name;
            this.type = obj.type;
            this.category = obj.category;
            this.details = obj.details;
            this.price = obj.price;
            this.allergens = obj.allergens;
        }
    }

    static table(){
        return 'product'
    }

    static visibleFields() {
        return [
            'id',
            'name',
            'type',
            'category',
            'details',
            'price',
        ];
    }

    toSQL(){
        const data = Utils.clone(this);
        delete data.allergens;
        return data;
    }
}