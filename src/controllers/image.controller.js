const HTMLResponse = require('../output/htmlResponse.output');
const BaseController = require('../utils/base.controller');
const ProductAllergen = require('../models/productAllergen.model');
const Utils = require('../utils/core.utils');
const PathUtils = require('../utils/fileSystem/pathUtils');
const Reader = require('../utils/fileSystem/reader');

class ImageController extends BaseController {

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { image } = req.params;
            const filePath = PathUtils.resolve('../public/images/' + image);
            console.log(filePath);
            if (!Reader.exists(filePath))
                return response.notFound('Not found image with name: ' + image);
            return response.sendFile(filePath);
        } catch (error) {
            console.log(error);
            return response.error('Ha ocurrido un error obteniendo la imagen', error);
        }
    }
}
module.exports = ImageController;

