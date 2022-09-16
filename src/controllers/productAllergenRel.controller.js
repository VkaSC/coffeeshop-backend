import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "../database/database";

const getProductByAllergen = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, allergen_id FROM product_allergen_relationship");
        return response.success('Products Allergens Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getAllergenByProduct = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, allergen_id FROM product_allergen_relationship WHERE id = ?", id);
        return response.success('Product Allergen Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addProductAllergenRel = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {product_id, allergen_id} = req.body;

        if (product_id== undefined || allergen_id== undefined){
            return response.badRequest('Missing one of these fields: product_id, allergen_id');
        } 

        const ProductAllergenRel = {product_id, allergen_id};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO product_allergen_relationship SET ?", ProductAllergenRel);
        return response.success('Product Allergen Created successfully', result);
    } catch (error) {
        return response.error(error);
    }
}


const deleteProductAllergenRel = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM product_allergen_relationship WHERE id = ?", id);
        return response.success('Product Allergen Deleted successfully');
    } catch (error) {
        return response.error(error);
    }
}

export default {
    getProductByAllergen,
    getAllergenByProduct,
    addProductAllergenRel,
    deleteProductAllergenRel
};