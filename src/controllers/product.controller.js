import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import Product from '../models/product.model';
import Utils from '../utils/core.utils';

export default class ProductControler extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, Product.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + Product.table();
            query += this.createWhereClause(req, Product.visibleFields(), queryParameters);
            query += this.createOrderByCaluse(req, Product.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            return response.success('Products Retrieved successfully', result);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", id);
            return response.success('Product Retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const product = new Product(req.body)
    
            if (product.name == undefined || product.type == undefined || product.category == undefined || product.price == undefined) {
                return response.badRequest('Missing one of these fields: nombre, grupo, categoria, pvp');
            }

            const result = await Connection.query("INSERT " + Product.table() + " product SET ?", product);
            const id = result.insertId;
            const data = await this.query("INSERT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + "WHER id = ?", id);
            return response.success('Product Created successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const product = new Product(req.body);
            if (product.id == undefined || product.name == undefined || product.type == undefined || product.category == undefined || product.price == undefined) {
                return response.badRequest('Missing one of these fields: nombre, grupo, categoria, pvp');
            }
    
            const result = await Connection.query("UPDATE " + Product.table() + " SET ? WHERE id = ?", [product, id]);
            const data = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id = ?", id);            
            return response.success('Product Updated successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await Connection.query("DELETE FROM " + Product.table() + " WHERE id = ?", id);
            return response.success('Product Deleted successfully');
        } catch (error) {
            return response.error(error);
        }
    }

}
