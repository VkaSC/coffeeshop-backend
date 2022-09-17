import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "../database/database";
import Request from '../models/request.model';

const getOrders = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT " + Request.visibleFields().join(', ') + " FROM " + Request.table());
        return response.success('Orders Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getOrder = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT " + Request.visibleFields().join(', ') + " FROM " + Request.table() + " WHERE id = ?", id);
        return response.success('Order Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addOrder = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const order = new Request(req.body);

        if (order.date == undefined) {
            return response.badRequest('Missing one of these fields: date')
        }
        if (order.userId == undefined && order.device == undefined) {
            return response.badRequest('The order must be linked to an user or a device')
        }
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO " + Request.table() + " SET ?", order.toSQL());
        return response.success('Order created successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const updateOrder = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        console.log(req.params);
        const { id } = req.params;
        const order = new Request(req.body);

        if (order.date == undefined) {
            return response.badRequest('Missing one of these fields: date')
        }
        if (order.userId == undefined && order.device == undefined) {
            return response.badRequest('The order must be linked to an user or a device')
        }
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE " + Request.table() + " SET ? WHERE id = ?", [order.toSQL(), id]);
        return response.success('Order updated successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const deleteOrder = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM " + Request.table() + " WHERE id = ?", id);
        return response.success('Order deleted successfully');
    } catch (error) {
        return response.error(error);
    }
}

export default {
    getOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder
};