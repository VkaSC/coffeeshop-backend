const fs = require("fs"); //Load the filesystem module


class Reader {

    static exists(filePath) {
        return fs.existsSync(filePath);
    }

    static sizeInBytes(path) {
        const stats = fs.statSync(path);
        return stats.size;
    }

    static sizeInKB(path) {
        return Reader.sizeInBytes(path) / 1000;
    }

    static sizeInMB(path) {
        return Reader.sizeInBytes(path) / 1000000;
    }

}
module.exports = Reader;