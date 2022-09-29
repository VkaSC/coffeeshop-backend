import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import ProductAllergen from '../models/productAllergen.model';
import Utils from '../utils/core.utils';
import PathUtils from '../utils/fileSystem/pathUtils';
import Reader from '../utils/fileSystem/reader';

export default class ImageController extends BaseController {

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { image } = req.params;
            const filePath = PathUtils.resolve('./src/uploads/images/' + image);
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


