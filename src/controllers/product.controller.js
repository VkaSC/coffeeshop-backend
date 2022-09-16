import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "./../database/database";

const getProducts = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, type, category, details, price FROM product");
        return response.success('Products Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getProduct = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, type, category, details, price FROM product WHERE id = ?", id);
        return response.success('Product Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addProduct = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {name, type, category, details, price} = req.body;

        if (name == undefined || type== undefined || category== undefined ||price== undefined){
            return response.badRequest('Missing one of these fields: nombre, grupo, categoria, pvp');
        } 

        const product = {name, type, category, details, price};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO product SET ?", product);
        return response.success('Product Created successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const updateProduct = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {id} = req.params;
        const {name, type, category, details, price} = req.body;

        if (id == undefined ||name == undefined || type== undefined || category== undefined ||price== undefined){
            return response.badRequest('Missing one of these fields: nombre, grupo, categoria, pvp');
        } 

        const product = {id, name, type, category, details, price};
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE product SET ? WHERE id = ?", [product, id]);
        return response.success('Product Updated successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const deleteProduct = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM product WHERE id = ?", id);
        return response.success('Product Deleted successfully');
    } catch (error) {
        return response.error(error);
    }
}

export default {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
};