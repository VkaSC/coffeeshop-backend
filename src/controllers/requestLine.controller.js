import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import OrderLine from '../models/orderLine.model';
import Utils from '../utils/core.utils';

export default class RequestLineController extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, Product.visibleFields());
            let query = "SELECT " + field.join(', ') + "FROM " + Product.table();
            query += this.createWhereClause(req, Product.visibleFields(), queryParameters);
            query += this.createOrderByCaluse(req, Product.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            return response.success('Products Retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE id = ?", id);
            return response.success('Order Request Lines Retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const orderLine = new OrderLine(req.body)
    
            if (OrderLine.productId == undefined || OrderLine.requestId == undefined || OrderLine.quantity == undefined) {
                return response.badRequest('Missing one of these fields: product_id, request_id, cantidad');
            }
            const result = await Connection.query("INSERT " + OrderLine.table() + " product SET ?", orderLine);
            const id = result.insertId;
            const data = await this.query("INSERT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + "WHER id = ?", id);
            return response.success('Request Line Created successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const Connection = await getConnection();
            const result = await Connection.query("DELETE FROM " + OrderLine.table() + " WHERE id = ?", id);
            return response.success('Request Line Deleted successfully');
        } catch (error) {
            return response.error(error);
        }
    }

}







