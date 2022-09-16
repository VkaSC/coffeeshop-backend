import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "../database/database";

const getAllergens = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, icon, details FROM allergen");
        return response.success('Allergens retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getAllergen = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, icon, details FROM allergen WHERE id = ?", id);
        return response.success('Allergen retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addAllergen = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { name, icon, details } = req.body;
        const allergen = { name, icon, details };
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO allergen SET ?", allergen);
        return response.success('Allergen created successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const updateAllergen = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const { name, icon, details } = req.body;
        const order = { id, name, icon, details };
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE allergen SET ? WHERE id = ?", [order, id]);
        return response.success('Allergen updated successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const deleteAllergen = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM allergen WHERE id = ?", id);
        return response.success('Allergen deleted successfully');
    } catch (error) {
        return response.error(error);
    }
}

export default {
    getAllergens,
    getAllergen,
    addAllergen,
    updateAllergen,
    deleteAllergen
};