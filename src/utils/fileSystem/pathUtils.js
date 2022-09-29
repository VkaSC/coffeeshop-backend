let path = require('path');
export default class PathUtils {

    static separator = path.sep;

    static resolve(filePath){
        return path.resolve(filePath);
    }

}