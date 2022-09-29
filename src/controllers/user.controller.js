import HTMLResponse from '../output/htmlResponse.output';
import BaseController from '../utils/base.controller';
import User from '../models/user.model';
import Utils from '../utils/core.utils';
import JWTUtils from '../utils/jwt.utils';
import Mailer from "../communications/mailer";
import userCommunications from '../communications/templates/user.comunications';
import bcrypt from 'bcryptjs';


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
            const { id } = req.params;
            const result = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + " WHERE id = ?", id);
            const user = result && result.length === 1 ? new User(result[0]) : undefined;
            if (!user) {
                return response.notFound('Not found user with id ' + id);
            }
            return response.success('User Retrieved successfully', user);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async create(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const user = new User(req.body)

            if (user.name == undefined || user.lastName == undefined || user.type == undefined || user.email == undefined) {
                return response.badRequest('Missing one of these fields: Nombre, Apellidos, Tipo de usuario, email', HTMLResponse.MISSING_DATA_STATUS)
            }
            user.password = bcrypt.hashSync(password);
            const result = await this.query("INSERT " + User.table() + " product SET ?", [user.toSQL()]);
            const id = result.insertId;
            const data = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + "WHERE id = ?", id);
            const userResult = new User(data[0]);
            const jwtUtils = new JWTUtils(3);
            const activateToken = jwtUtils.generate({ id: userResult.id, action: JWTUtils.CREDENTIALS_ACTION });
            const revokeToken = jwtUtils.generate({ id: userResult.id, action: JWTUtils.REVOKE_ACTION });
            const tokenActivation = new Token();
            tokenActivation.token = activateToken;
            tokenActivation.active = true;
            tokenActivation.userId = user.id;
            await this.query('INSERT into ' + Token.table() + ' SET ?', [tokenActivation]);
            const tokenRevocation = new Token();
            tokenRevocation.token = revokeToken;
            tokenRevocation.active = true;
            tokenRevocation.userId = user.id;
            await this.query('INSERT into ' + Token.table() + ' SET ?', [tokenRevocation]);
            const mailer = new Mailer();
            mailer.addModel(User.table(), userResult);
            mailer.addModel('urls', { activate: config.frontHost + '/credenciales/crear/' + activateToken, revoke: config.frontHost + '/revocar/' + revokeToken });
            await mailer.sendEmail(config.email, userResult.email, userCommunications.welcome.emailSubject, userCommunications.welcome.emailHTMLBody);
            return response.success('User Created successfully', userResult);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async update(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const user = new User(req.body);
            const searchResult = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + " WHERE id = ?", id);
            const searchUser = searchResult && searchResult.length === 1 ? new User(searchResult[0]) : undefined;
            if (!searchUser) {
                return response.notFound('Not found user with id ' + id);
            }
            if (user.id == undefined || user.name == undefined || user.lastName == undefined || user.type == undefined || user.email == undefined) {
                return response.badRequest('Missing one of these fields: Nombre, Apellidos, Tipo de usuario, email', HTMLResponse.MISSING_DATA_STATUS)
            }

            const result = await this.query("UPDATE " + User.table() + " SET ? WHERE id = ?", [user.toSQL(true), id]);
            const data = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + " WHERE id = ?", id);
            return response.success('User Updated successfully', data[0]);
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async delete(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { id } = req.params;
            const searchResult = await this.query("SELECT " + User.visibleFields().join(', ') + " FROM " + User.table() + " WHERE id = ?", id);
            const searchUser = searchResult && searchResult.length === 1 ? new User(searchResult[0]) : undefined;
            if (!searchUser) {
                return response.notFound('Not found user with id ' + id);
            }
            const result = await this.query("DELETE FROM " + User.table() + " WHERE id = ?", id);
            return response.success('User Deleted successfully');
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }
}
