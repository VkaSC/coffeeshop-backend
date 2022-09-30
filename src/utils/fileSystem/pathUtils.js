let path = require('path');
class PathUtils {

    static separator = path.sep;

    static resolve(filePath){
        return path.resolve(filePath);
    }

}
module.exports = PathUtils;