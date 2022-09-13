import { restart } from "nodemon";
import { getConnection } from "../database/database";

const getAllergens = async (req, res) => {
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, icon, details FROM allergen");
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const getAllergen = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, icon, details FROM allergen WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const addAllergen = async (req, res) => {
    try {
        const {name, icon, details} = req.body;

        if (name == undefined || icon== undefined || details== undefined){
            restart.status(400).json({message: "Los campos cliente, fecha, hora deben estar rellenos"});
        } 

        const allergen = {name, icon, details};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO allergen SET ?", allergen);
        res.json("Se ha añadido correctamente");
        
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const updateAllergen = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const {name, icon, details} = req.body;

        if (id == undefined ||name == undefined || icon== undefined || details== undefined){
            restart.status(400).json({message: "Los campos cliente, fecha, hora deben estar rellenos"});
        } 

        const order = {id, name, icon, details};
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE allergen SET ? WHERE id = ?", [order, id]);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const deleteAllergen = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM allergen WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const methods = {
    getAllergens,
    getAllergen,
    addAllergen,
    updateAllergen,
    deleteAllergen
};