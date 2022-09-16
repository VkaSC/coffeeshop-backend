import HTMLResponse from '../output/htmlResponse.output';
import { getConnection } from "../database/database";

const getUsers = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, lastName, type, email FROM user");
        return response.success('Users Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const getUser = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        console.log(req.params);
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("SELECT id, name, lastName, type, email FROM user WHERE id = ?", id);
        return response.success('User Retrieved successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const addUser = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { name, lastName, type, email } = req.body;

        if (name == undefined || lastName == undefined || type == undefined || email == undefined) {
            return response.badRequest('Missing one of these fields: Nombre, Apellidos, Tipo de usuario, email')
        }

        const user = { name, lastName, type, email };
        const Connection = await getConnection();
        const result = await Connection.query("INSERT INTO allergen SET ?", user);
        return response.success('User Created successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const updateUser = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const { name, lastName, type, email } = req.body;

        if (id == undefined || name == undefined || lastName == undefined || type == undefined || email == undefined) {
            return response.badRequest('Missing one of these fields: Nombre, Apellidos, Tipo de usuario, email')
        }

        const order = { id, name, lastName, type, email };
        const Connection = await getConnection();
        const result = await Connection.query("UPDATE user SET ? WHERE id = ?", [order, id]);
        return response.success('User Updated successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

const deleteUser = async (req, res) => {
    const response = new HTMLResponse(req, res);
    try {
        const { id } = req.params;
        const Connection = await getConnection();
        const result = await Connection.query("DELETE FROM user WHERE id = ?", id);
        return response.success('User Deleted successfully', result);
    } catch (error) {
        return response.error(error);
    }
}

export default {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
};