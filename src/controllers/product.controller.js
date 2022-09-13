import { restart } from "nodemon";
import { getConnection } from "./../database/database";

const getProducts = async (req, res) => {
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, type, category, details, price FROM product");
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const getProduct = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, type, category, details, price FROM product WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const addProduct = async (req, res) => {
    try {
        const {name, type, category, details, price} = req.body;

        if (name == undefined || type== undefined || category== undefined ||price== undefined){
            restart.status(400).json({message: "Los campos nombre, grupo, categoria y pvp deben estar rellenos"});
        } 

        const product = {name, type, category, details, price};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO product SET ?", product);
        res.json("El producto se ha añadido correctamente");
        
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const updateProduct = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const {name, type, category, details, price} = req.body;

        if (id == undefined ||name == undefined || type== undefined || category== undefined ||price== undefined){
            restart.status(400).json({message: "Los campos nombre, grupo, categoria y pvp deben estar rellenos"});
        } 

        const product = {id, name, type, category, details, price};
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE product SET ? WHERE id = ?", [product, id]);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const deleteProduct = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM product WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const methods = {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
};