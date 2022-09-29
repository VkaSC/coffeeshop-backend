import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import Order from '../models/order.model';
import Utils from '../utils/core.utils';
import OrderLine from '../models/orderLine.model';
import Product from '../models/product.model';
import DateUtils from '../utils/date.utils';

const HOUR_LIMIT = 8;
const MINUTES_LIMIT = 15;
const PRODUCTS_LIMIT = 3;

export default class OrderController extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, Order.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + Order.table();
            query += this.createWhereClause(req, Order.visibleFields(), queryParameters);
            query += this.createOrderByCaluse(req, Order.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            if (req.query.expand && req.query.expand.toLowerCase() === "true") {
                const orderLinesByOrder = {};
                if (result && result.length > 0) {
                    const orderIds = [];
                    for (const orderResult of result) {
                        const order = new Order(orderResult);
                        orderIds.push(order.id);
                    }
                    const orderLinesResult = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE requestId IN (?)", [orderIds]);
                    if (orderLinesResult && orderLinesResult.length > 0) {
                        const productIds = [];
                        const productMap = {};
                        for (const orderLineResult of orderLinesResult) {
                            const orderLine = new OrderLine(orderLineResult);
                            if (!productIds.includes(orderLine.productId)) {
                                productIds.push(orderLine.productId);
                            }
                        }
                        if (productIds.length > 0) {
                            const productsResult = await this.query("SELECT " + Product.visibleFields().join(', ') + " FROM " + Product.table() + " WHERE id IN (?)", [productIds]);
                            if (productsResult && productsResult.length > 0) {
                                for (const productResult of productsResult) {
                                    const product = new Product(productResult);
                                    productMap[product.id] = product;
                                }
                            }
                        }
                        for (const orderLineResult of orderLinesResult) {
                            const orderLine = new OrderLine(orderLineResult);
                            orderLine.product = productMap[orderLine.productId];
                            if (!orderLinesByOrder[orderLine.requestId]) {
                                orderLinesByOrder[orderLine.requestId] = []
                            }
                            orderLinesByOrder[orderLine.requestId].push(orderLine);
                        }
                    }
                    for (const orderResult of result) {
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
            const order = result && result.length === 1 ? new Order(result[0]) : undefined;
            if (!order) {
                return response.notFound('Not found order with id ' + id);
            }
            if (req.query.expand && req.query.expand.toLowerCase() === "true") {
                const orderLines = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE requestId = ?", id);
                order.lines = Utils.forceArray(orderLines);
            }
            return response.success('Order Retrieved successfully', order);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const today = DateUtils.todayEsES();
            const order = new Order(req.body);
            console.log(order);
            let totalElements = 0;
            if (order.date == undefined) {
                return response.badRequest('Missing one of these fields: date', HTMLResponse.MISSING_DATA_STATUS)
            }
            if (order.userId == undefined && order.device == undefined) {
                return response.badRequest('The order must be linked to an user or a device', HTMLResponse.MISSING_DATA_STATUS)
            }
            if (order.lines && order.lines.length > 0) {
                for (const line of order.lines) {
                    const orderLine = new OrderLine(line);
                    if (orderLine.productId == undefined || orderLine.quantity == undefined) {
                        return response.badRequest('Missing one of these fields in order lines: productid, requestid, cantidad', HTMLResponse.MISSING_DATA_STATUS);
                    }
                    totalElements += orderLine.quantity;
                }

            }
            if (!req.user) {
                let existingLines;
                if(today.getUTCHours() > HOUR_LIMIT && today.getUTCMinutes() > MINUTES_LIMIT){
                    const todayLimit = DateUtils.exactDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), HOUR_LIMIT, MINUTES_LIMIT, 0);
                    existingLines = await this.query("SELECT " + OrderLine.visibleFields().join(',') + " FROM " + OrderLine.table() + " WHERE requestId in (Select id from " + Order.table() + " WHERE device = ? and date > ?)", [order.device, todayLimit.getTime()]);
                } else {
                    const todayLimit = DateUtils.exactDate(today.getFullYear(), today.getMonth() + 1, today.getDate(), HOUR_LIMIT, MINUTES_LIMIT, 0);
                    const yesterdayLimit = new Date(todayLimit.getTime() - DateUtils.getDaysInMillis(1));
                    existingLines = await this.query("SELECT " + OrderLine.visibleFields().join(',') + " FROM " + OrderLine.table() + " WHERE requestId in (Select id from " + Order.table() + " WHERE device = ? and date > ? and date <= ?)", [order.device, yesterdayLimit.getTime(), todayLimit.getTime()]);
                }
                if(existingLines && existingLines.length > 0){
                    for(const line of existingLines){
                        const orderLine = new OrderLine(line);
                        totalElements += orderLine.quantity;
                    }
                }
                console.log(existingLines);
                if (totalElements > PRODUCTS_LIMIT) {
                    return response.unauthorized('Unregisterd users can\'t order more than ' + PRODUCTS_LIMIT + ' products', HTMLResponse.LIMIT_REACHED_STATUS);
                }
            }
            order.date = DateUtils.todayEsES().getTime();
            const result = await this.query("INSERT INTO " + Order.table() + " SET ?", order.toSQL());
            const id = result.insertId;
            const data = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            const createdOrder = new Order(data[0]);
            if (order.lines && order.lines.length > 0) {
                const orderLinesIds = [];
                for (const line of order.lines) {
                    const orderLine = new OrderLine(line);
                    orderLine.requestId = createdOrder.id;
                    const result = await this.query("INSERT " + OrderLine.table() + " SET ?", orderLine.toSQL());
                    const id = result.insertId;
                    orderLinesIds.push(id);
                }
                const createdLines = await this.query("SELECT " + OrderLine.visibleFields().join(', ') + " FROM " + OrderLine.table() + " WHERE id IN (?)", [orderLinesIds]);
                createdOrder.lines = createdLines;
            }
            return response.success('Order created successfully', createdOrder);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const order = new Order(req.body);
            order.id = id;
            const searchResult = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            const searchOrder = searchResult && searchResult.length === 1 ? new Order(searchResult[0]) : undefined;
            if (!searchOrder) {
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
            return response.success('Order updated successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const searchResult = await this.query("SELECT " + Order.visibleFields().join(', ') + " FROM " + Order.table() + " WHERE id = ?", id);
            const searchOrder = searchResult && searchResult.length === 1 ? new Order(searchResult[0]) : undefined;
            if (!searchOrder) {
                return response.notFound('Not found order with id ' + id);
            }
            const result = await this.query("DELETE FROM " + Order.table() + " WHERE id = ?", id);
            return response.success('Order deleted successfully');
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

}







