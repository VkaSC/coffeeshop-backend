import { restart } from "nodemon";
import { getConnection } from "../database/database";

const getProductByAllergen = async (req, res) => {
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, allergen_id FROM product_allergen_relationship");
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const getAllergenByProduct = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, allergen_id FROM product_allergen_relationship WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const addProductAllergenRel = async (req, res) => {
    try {
        const {product_id, allergen_id} = req.body;

        if (product_id== undefined || allergen_id== undefined){
            restart.status(400).json({message: "Los campos product_id, allergen_id deben estar rellenos"});
        } 

        const ProductAllergenRel = {product_id, allergen_id};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO product_allergen_relationship SET ?", ProductAllergenRel);
        res.json("Se ha añadido correctamente");
        
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


const deleteProductAllergenRel = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM product_allergen_relationship WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const methods = {
    getProductByAllergen,
    getAllergenByProduct,
    addProductAllergenRel,
    deleteProductAllergenRel
};