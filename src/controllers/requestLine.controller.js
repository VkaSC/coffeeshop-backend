import { restart } from "nodemon";
import { getConnection } from "../database/database";

const getProductByOrder = async (req, res) => {
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, request_id, quantity FROM product_request_relationship");
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const getOrderByProduct = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, product_id, request_id, quantity FROM product_request_relationship WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const addRequestLine = async (req, res) => {
    try {
        const {product_id, request_id, quantity} = req.body;

        if (product_id== undefined || request_id== undefined || quantity== undefined){
            restart.status(400).json({message: "Los campos product_id, request_id, cantidad deben estar rellenos"});
        } 

        const RequestLine = {product_id, request_id, quantity};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO product_request_relationship SET ?", RequestLine);
        res.json("Se ha añadido correctamente");
        
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


const deleteRequestLine = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM product_request_relationship WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const methods = {
    getProductByOrder,
    getOrderByProduct,
    addRequestLine,
    deleteRequestLine
};