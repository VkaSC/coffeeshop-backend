import { restart } from "nodemon";
import { getConnection } from "../database/database";

const getUsers = async (req, res) => {
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, lastName, type, email FROM user");
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const getUser = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, lastName, type, email FROM user WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const addUser = async (req, res) => {
    try {
        const {name, lastName, type, email} = req.body;

        if (name == undefined || lastName== undefined || type== undefined || email== undefined){
            restart.status(400).json({message: "Los campos Nombre, Apellidos, Tipo de usuario e email deben estar rellenos"});
        } 

        const user = {name, lastName, type, email};
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO allergen SET ?", user);
        res.json("Se ha añadido correctamente");
        
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const {name, lastName, type, email} = req.body;

        if (id == undefined ||name == undefined || lastName== undefined || type== undefined || email== undefined){
            restart.status(400).json({message: "Los campos Nombre, Apellidos, Tipo de usuario e email deben estar rellenos"});
        } 

        const order = {id, name, lastName, type, email};
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE user SET ? WHERE id = ?", [order, id]);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM user WHERE id = ?", id);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
};