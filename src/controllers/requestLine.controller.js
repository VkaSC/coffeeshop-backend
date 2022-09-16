import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "../database/database";

const getRequestLinesByProduct = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, request_id, quantity FROM product_request_relationship WHERE product_id = ?", id);
        return response.success('Order Request Lines Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getRequestLinesByRequest = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, request_id, quantity FROM product_request_relationship WHERE request_id = ?", id);
        return response.success('Order Request Lines Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getRequestLines = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, request_id, quantity FROM product_request_relationship");
        return response.success('Order Request Lines Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getRequestLine = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, request_id, quantity FROM product_request_relationship WHERE id = ?", id);
        return response.success('Order Request Line Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addRequestLine = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { product_id, request_id, quantity } = req.body;

        if (product_id == undefined || request_id == undefined || quantity == undefined) {
            return response.badRequest('Missing one of these fields: product_id, request_id, cantidad');
        }

        const RequestLine = { product_id, request_id, quantity };
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO product_request_relationship SET ?", RequestLine);
        return response.success('Request Line Created successfully', result);
    } catch (error) {
        return response.error(error);
    }
}


const deleteRequestLine = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM product_request_relationship WHERE id = ?", id);
        return response.success('Request Line Deleted successfully');
    } catch (error) {
        return response.error(error);
    }
}

export default {
    getRequestLinesByProduct,
    getRequestLinesByRequest,
    getRequestLine,
    getRequestLines,
    addRequestLine,
    deleteRequestLine
};