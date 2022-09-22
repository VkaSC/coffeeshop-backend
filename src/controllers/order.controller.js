import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import Order from '../models/order.model'; 
import Utils from '../utils/core.utils';
import OrderLine from '../models/orderLine.model';




export default class OrderController extends BaseController {

    async  list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, Order.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + Order.table();
            query += this.createWhereClause(req, Order.visibleFields(), queryParameters);
            query += this.createOrderByCaluse (req, Order.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            if (req.query.expand && req.query.expand.toLowerCase() === "true") {
                const orderLinesByOrder = {};
                if(result && result.length > 0){
                    const orderIds = [];
                    for(const orderResult of result){
                        const order = new Order(orderResult);
                        orderIds.push(order.id);
                    }
                    const orderLinesResult = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE requestId IN (?)", orderIds);
                    if(orderLinesResult && orderLinesResult.length > 0){
                        for(const orderLineResult of orderLinesResult){
                            const orderLine = new OrderLine(result);
                            if(!orderLinesByOrder[orderLine.requestId]){
                                orderLinesByOrder[orderLine.requestId] = []
                            }
                            orderLinesByOrder[orderLine.requestId].push(orderLineResult);
                        }
                    }
                    for(const orderResult of result){
                        orderResult.lines = orderLinesByOrder[orderResult.id] || [];
                    }
                }
            }
            return response.success('Orders Retrieved successfully', result);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            const order = result && result.length === 1 ? new Order(result) : undefined;
            if(!order){
                return response.notFound('Not found order with id ' + id);
            } 
            if (req.query.expand && req.query.expand.toLowerCase() === "true") {
                const orderLines = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE requestId = ?", id);
                order.lines = Utils.forceArray(orderLines);
            }
            return response.success('Order Retrieved successfully', order);
        } catch (error) {
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const order = new Order(req.body);
            if (order.date == undefined) {
                return response.badRequest('Missing one of these fields: date', HTMLResponse.MISSING_DATA_STATUS)
            }
            if (order.userId == undefined && order.device == undefined) {
                return response.badRequest('The order must be linked to an user or a device', HTMLResponse.MISSING_DATA_STATUS)
            }

            const result = await this.query("INSERT INTO " + Order.table() + " SET ?", order.toSQL());
            const id = result.insertId;
            const data = await this.query("INSERT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + "WHER id = ?", id);
            return response.success('Order created successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const order = new Order(req.body);
            const searchResult = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            const searchOrder = result && result.length === 1 ? new Order(searchResult) : undefined;
            if(!searchOrder){
                return response.notFound('Not found order with id ' + id);
            } 
            if (order.date == undefined) {
                return response.badRequest('Missing one of these fields: date', HTMLResponse.MISSING_DATA_STATUS)
            }
            if (order.userId == undefined && order.device == undefined) {
                return response.badRequest('The order must be linked to an user or a device', HTMLResponse.MISSING_DATA_STATUS)
            }
    
            const result = await this.query("UPDATE " + Order.table() + " SET ? WHERE id = ?", [order.toSQL(), id]);
            const data = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            return response.success('Order updated successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const searchResult = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            const searchOrder = result && result.length === 1 ? new Order(searchResult) : undefined;
            if(!searchOrder){
                return response.notFound('Not found order with id ' + id);
            } 
            const result = await this.query("DELETE FROM " + Order.table() + " WHERE id = ?", id);
            return response.success('Order deleted successfully');
        } catch (error) {
            return response.error(error);
        }
    }

}







