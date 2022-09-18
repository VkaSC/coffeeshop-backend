import Utils from '../utils/core.utils';

export default class Allergen {

    id;
    name;
    icon;
    details;

    constructor(obj) {
        if (Utils.isObject(obj)) {
            this.id = obj.id;
            this.name = obj.name;
            this.icon = obj.icon;
            this.details = obj.details;
        }
    }

    static table(){
        return 'allergen'
    }

    static visibleFields() {
        return [
            'id',
            'name',
            'icon',
            'details',
        ];
    }
}