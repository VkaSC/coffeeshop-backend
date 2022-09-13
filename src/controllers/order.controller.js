import { restart } from "nodemon";
import { getConnection } from "../database/database";

const getOrders = async (req, res) => {
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, user, requestDay, requestHour FROM request");
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const getOrder = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, user, requestDay, requestHour FROM request WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const addOrder = async (req, res) => {
    try {
        const {user, requestDay, requestHour} = req.body;

        if (user == undefined || requestDay== undefined || requestHour== undefined){
            restart.status(400).json({message: "Los campos cliente, fecha, hora deben estar rellenos"});
        } 

        const order = {user, requestDay, requestHour};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO request SET ?", order);
        res.json("El pedido se ha añadido correctamente");
        
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const updateOrder = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const {user, requestDay, requestHour} = req.body;

        if (id == undefined ||user == undefined || requestDay== undefined || requestHour== undefined){
            restart.status(400).json({message: "Los campos cliente, fecha, hora deben estar rellenos"});
        } 

        const order = {id, user, requestDay, requestHour};
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE request SET ? WHERE id = ?", [order, id]);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const deleteOrder = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM request WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const methods = {
    getOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder
};