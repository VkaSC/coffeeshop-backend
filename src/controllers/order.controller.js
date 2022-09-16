import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "../database/database";

const getOrders = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, user, requestDay, requestHour FROM request");
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
        const result = await Connection.query("SELECT id, user, requestDay, requestHour FROM request WHERE id = ?", id);
        return response.success('Order Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addOrder = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { user, requestDay, requestHour } = req.body;

        if (user == undefined || requestDay == undefined || requestHour == undefined) {
            return response.badRequest('Missing one of these fields: cliente, fecha, hora')
        }

        const order = { user, requestDay, requestHour };
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO request SET ?", order);
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
        const { user, requestDay, requestHour } = req.body;

        if (id == undefined || user == undefined || requestDay == undefined || requestHour == undefined) {
            return response.badRequest('Missing one of these fields: cliente, fecha, hora')
        }

        const order = { id, user, requestDay, requestHour };
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE request SET ? WHERE id = ?", [order, id]);
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
        const result = await Connection.query("DELETE FROM request WHERE id = ?", id);
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