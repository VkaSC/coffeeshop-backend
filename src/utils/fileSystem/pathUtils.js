let path = require('path');
class PathUtils {

    static get separator() {
        return path.sep;
    };

    static resolve(filePath){
        return path.resolve(filePath);
    }

}
module.exports = PathUtils;