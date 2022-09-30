const StrUtils = require('../utils/str.utils');

class TemplateProcessor {

    static merge(template, models) {
        for (let modelName of Object.keys(models)) {
            template = replaceModel(template, models[modelName], modelName);
        }
        return template;
    }

}

function replaceModel(template, model, parent) {
    if (!parent)
        parent = '';
    if(!parent.endsWith('.'))
        parent += '.';
    for (let field of Object.keys(model)) {
        let fieldValue = model[field];
        if(!fieldValue)
            fieldValue = '';
        let fieldToReplace = parent + field;
        if (typeof fieldValue === 'object') {
            template = replaceModel(template, fieldValue, fieldToReplace);
        } else {
            template = StrUtils.replace(template, '{!' + fieldToReplace + '}', fieldValue);
        }
    }
    return template;
}
module.exports = TemplateProcessor;