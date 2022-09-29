import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import OrderLine from '../models/orderLine.model';
import Utils from '../utils/core.utils';
import DateUtils from '../utils/date.utils';
import Order from '../models/order.model';

const HOUR_LIMIT = 8;
const MINUTES_LIMIT = 15;
const PRODUCTS_LIMIT = 3;

export default class OrderLineController extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id, order } = req.params;
            let queryParameters = [order];
            const fields = this.getQueryFields(req, OrderLine.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + OrderLine.table();
            query += this.createWhereClause(req, OrderLine.visibleFields(), queryParameters);
            query += this.createOrderByCaluse(req, OrderLine.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            return response.success('Order Lines Retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id, order } = req.params;
            const result = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE id = ? AND requestId = ?", [id, order]);
            const orderLine = result && result.length === 1 ? new OrderLine(result[0]) : undefined;
            if (!orderLine) {
                return response.notFound('Not found Order Line with id ' + id);
            }
            return response.success('Order Lines Retrieved successfully', orderLine);
        } catch (error) {
            return response.error(error);
        }
    }

    async create(req, res) {
        const today = DateUtils.todayEsES();
        const response = new HTMLResponse(req, res);
        try {
            const { order } = req.params;
            let totalElements = 0;
            const orderLinesInput = Utils.forceArray(req.body);
            if (orderLinesInput && orderLinesInput.length == 0) {
                return response.badRequest('You must send at least one order line', HTMLResponse.TOO_LESS_DATA_STATUS);
            }
            for (const orderLineInput of orderLinesInput) {
                const orderLine = new OrderLine(orderLineInput);
                if (orderLine.productId == undefined || orderLine.requestId == undefined || orderLine.quantity == undefined) {
                    return response.badRequest('Missing one of these fields: productid, requestid, cantidad', HTMLResponse.MISSING_DATA_STATUS);
                }
                if (orderLine.requestId !== Number(order)) {
                    return response.badRequest('Can\' create orders lines to different orders at the same time', HTMLResponse.INTEGRITY_DATA_STATUS);
                }
                totalElements += orderLine.quantity;
            }
            if (!req.user) {
                let existingLines;
                const orderObj = await this.query("SELECT " + Order.visibleFields().join(',') + " FROM " + Order.table() + " WHERE id = ?", [order]);
                if (today.getUTCHours() > HOUR_LIMIT && today.getUTCMinutes() > MINUTES_LIMIT) {
                    const todayLimit = DateUtils.exactDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), HOUR_LIMIT, MINUTES_LIMIT, 0);
                    existingLines = await this.query("SELECT " + OrderLine.visibleFields().join(',') + " FROM " + OrderLine.table() + " WHERE requestId in (Select id from " + Order.table() + " WHERE device = ? and date > ?)", [orderObj[0].device, todayLimit.getTime()]);
                } else {
                    const todayLimit = DateUtils.exactDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), HOUR_LIMIT, MINUTES_LIMIT, 0);
                    const yesterdayLimit = new Date(todayLimit.getTime() - DateUtils.getDaysInMillis(1));
                    existingLines = await this.query("SELECT " + OrderLine.visibleFields().join(',') + " FROM " + OrderLine.table() + " WHERE requestId in (Select id from " + Order.table() + " WHERE device = ? and date > ? and date <= ?)", [orderObj[0].device, yesterdayLimit.getTime(), todayLimit.getTime()]);
                }
                if (existingLines && existingLines.length > 0) {
                    for (const line of existingLines) {
                        const orderLine = new OrderLine(line);
                        totalElements += orderLine.quantity;
                    }
                }
                if (totalElements > PRODUCTS_LIMIT) {
                    return response.unauthorized('Unregisterd users can\'t order more than ' + PRODUCTS_LIMIT + ' products', HTMLResponse.LIMIT_REACHED_STATUS);
                }
            }
            const orderLinesIds = [];
            for (const orderLineInput of orderLinesInput) {
                const orderLine = new OrderLine(orderLineInput);
                const result = await this.query("INSERT " + OrderLine.table() + " SET ?", orderLine.toSQL());
                const id = result.insertId;
                orderLinesIds.push(id);
            }
            const data = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE id IN (?)", [orderLinesIds]);
            return response.success('Order Line Created successfully', data);
        } catch (error) {
            console.log(error)
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id, order } = req.params;
            const searchResult = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ? AND requestId = ?", [id, order]);
            const searchOrder = searchResult && searchResult.length === 1 ? new Order(searchResult[0]) : undefined;
            if (!searchOrder) {
                return response.notFound('Not found order line to order ' + order + ' with id ' + id);
            }
            const result = await this.query("DELETE FROM " + OrderLine.table() + " WHERE id = ? AND requestId = ?", [id, order]);
            return response.success('Order Line Deleted successfully');
        } catch (error) {
            return response.error(error);
        }
    }

}







