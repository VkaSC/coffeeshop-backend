import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import User from '../models/user.model';
import Utils from '../utils/core.utils';


export default class UserControler extends BaseController {

    async list(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            let queryParameters = [];
            const fields = this.getQueryFields(req, User.visibleFields());
            let query = "SELECT " + fields.join(', ') + " FROM " + User.table();
            query += this.createWhereClause(req, User.visibleFields(), queryParameters);
            query += this.createOrderByCaluse(req, User.visibleFields());
            query += this.createLimitClause(req);
            const result = await this.query(query, queryParameters);
            return response.success('Products Retrieved successfully', result);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async get(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            console.log(req.params);
            const result = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + " WHERE id = ?", id);
            return response.success('User Retrieved successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const user = new User(req.body)
    
            if (user.name == undefined || user.lastName == undefined || user.type == undefined || user.email == undefined) {
                return response.badRequest('Missing one of these fields: Nombre, Apellidos, Tipo de usuario, email')
            }
    
            const result = await Connection.query("INSERT " + User.table() + " product SET ?", user);
            const id = result.insertId;
            const data = await this.query("INSERT " + User.visibleFields().join(', ') + " FROM " + User.table() + "WHER id = ?", id);
            return response.success('User Created successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const user = new User(req.body);
    
            if (user.id == undefined || user.name == undefined || user.lastName == undefined || user.type == undefined || user.email == undefined) {
                return response.badRequest('Missing one of these fields: Nombre, Apellidos, Tipo de usuario, email')
            }
    
            const result = await Connection.query("UPDATE " + User.table() + " SET ? WHERE id = ?", [user, id]);
            const data = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + " WHERE id = ?", id);            
            return response.success('User Updated successfully', data);
        } catch (error) {
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const result = await this.query("DELETE FROM " + User.table() + " WHERE id = ?", id);
            return response.success('User Deleted successfully', result);
        } catch (error) {
            return response.error(error);
        }
    }
}
