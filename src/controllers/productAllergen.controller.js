import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import ProductAllergen from '../models/productAllergen.model';
import Utils from '../utils/core.utils';

export default class ProductAllergenController extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, ProductAllergen.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + ProductAllergen.table();
            query += this.createWhereClause(req, ProductAllergen.visibleFields(), queryParameters);
            query += this.createOrderByCaluse (req, ProductAllergen.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            return response.success('Products Allergens Retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const {id} = req.params;
            const result = await this.query("SELECT " + ProductAllergen.visibleFields().join(', ') + " FROM " + ProductAllergen.table() + " WHERE id = ?", id);
            const searchProductAllergen = result && result.length === 1 ? new ProductAllergen(result[0]) : undefined;
            if (!searchProductAllergen) {
                return response.notFound('Not found product allergen with id ' + id);
            }
            return response.success('Product Allergen Retrieved successfully', searchProductAllergen);
        } catch (error) {
            return response.error(error);
        }
    }

     async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const productAllergen = new ProductAllergen(req.body);
    
            if (productAllergen.productId== undefined || productAllergen.allergenId== undefined){
                return response.badRequest('Missing one of these fields: productId, allergenId', HTMLResponse.MISSING_DATA_STATUS);
            } 
    
            const result = await this.query("INSERT INTO " + ProductAllergen.table() + " SET ?", productAllergen);
            const id = result.insertId;
            const data = await this.query("SELECT " + ProductAllergen.visibleFields().join(', ') + " FROM " + ProductAllergen.table() + " WHERE id = ?", id);
            return response.success('Product Allergen Created successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const {id} = req.params;
            const searchResult = await this.query("SELECT " + ProductAllergen.visibleFields().join(', ') + " FROM " + ProductAllergen.table() + " WHERE id = ?", [id]);
            const searchProduct = searchResult && searchResult.length === 1 ? new ProductAllergen(searchResult[0]) : undefined;
            if (!searchProduct) {
                return response.notFound('Not found product allergen with id ' + id);
            }
            const result = await this.query("DELETE FROM " + ProductAllergen.table() + " WHERE id = ?", id);
            return response.success('Product Allergen Deleted successfully');
        } catch (error) {
            return response.error(error);
        }
    }

}


