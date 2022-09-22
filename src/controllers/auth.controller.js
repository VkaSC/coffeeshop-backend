import HTMLResponse from '../output/htmlResponse.output';
import BaseController from "../utils/base.controller";
import JWTUtils from "../utils/jwt.utils";
import User from "../models/user.model";
import Token from "../models/token.model";
import Utils from '../utils/core.utils';
import config from "../config";
import Mailer from "../communications/mailer";
import userCommunications from '../communications/templates/user.comunications';
import bcrypt from 'bcryptjs';

export default class AuthController extends BaseController {

    async login(req, res) {
        console.log(bcrypt.hashSync('1234'));
        const response = new HTMLResponse(req, res);
        try {
            const { email, password, remember } = req.body;
            if (!email && !password) {
                return response.badRequest('Email and Password are required', HTMLResponse.MISSING_DATA_STATUS);
            }
            const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ', password FROM ' + User.table() + ' WHERE email = ?', [email]);
            if (userResult && userResult.length > 0) {
                const user = new User(userResult[0]);
                const isPasswordMatch = await bcrypt.compare(password, user.password)
                if (!isPasswordMatch) {
                    return response.unauthorized('Invalid Login Credentials.', HTMLResponse.INVALID_CREDENTIALS_STATUS);
                }
                if (!user.active) {
                    return response.unauthorized('The user is not active.', HTMLResponse.INACTIVE_USER_STATUS);
                }
                const jwtUtils = new JWTUtils();
                const tokenText = jwtUtils.generate(JWTUtils.getUserPayload(user));
                const token = new Token();
                token.token = tokenText;
                token.active = true;
                token.userId = user.id;
                token.remember = remember;
                await this.query('INSERT into ' + Token.table() + ' SET ?', [token]);
                const protocol = req.protocol;
                const host = req.hostname;
                const returnedUser = Utils.clone(user);
                delete returnedUser.password;
                return response.success('User logged Successfully', {
                    host: `${protocol}://${host}/api`,
                    user: returnedUser,
                    access_token: tokenText,
                });
            } else {
                return response.notFound('User not found');
            }
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async logout(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            if (!req.header(JWTUtils.USER_AUTH_HEADER))
                return response.badRequest('Not ' + JWTUtils.USER_AUTH_HEADER + ' header on request', HTMLResponse.MISSING_AUTH_STATUS);
            const tokenValue = req.header(JWTUtils.USER_AUTH_HEADER).replace('Bearer ', '');
            const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verify(tokenValue);
            if (tokenVerification.success || tokenVerification.reason === JWTUtils.EXPIRED_ERROR) {
                if (tokenVerification.success) {
                    if (tokenVerification.decoded.action !== JWTUtils.APP_AUTH_ACTION)
                        return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                    const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                    if (!userResult || userResult.length == 0)
                        return response.unauthorized('Not authorized to access this resource', HTMLResponse.UNAUTHORIZED_STATUS);
                    const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' FROM ' + Token.table() + ' WHERE token = ?', [tokenValue])
                    if (tokenResult && tokenResult.length > 0) {
                        tokenResult[0].active = false;
                        await this.query('UPDATE ' + Token.table() + ' SET ? WHERE id = ?', [tokenResult[0], tokenResult[0].id]);
                    } else if (tokenVerification.reason !== JWTUtils.EXPIRED_ERROR) {
                        const token = new Token();
                        token.token = tokenText;
                        token.active = false;
                        token.userId = tokenVerification.decoded.id;
                        await this.query('INSERT INTO ' + Token.table() + ' SET ?', [token]);
                    }
                }
                return response.success('User logout successfully');
            } else {
                return JWTUtils.processError(response, tokenVerification);
            }
        } catch (error) {
            console.log(error);
            return response.error(error);
        }
    }

    async activationEmail(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const { email } = req.body;
            if (!email) {
                return response.badRequest('Email is required', HTMLResponse.MISSING_DATA_STATUS);
            }
            const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE email = ?', [email]);
            if (!userResult || userResult.length === 0)
                return response.notFound('User not found.');
            else {
                const user = new User(userResult[0]);
                const jwtUtils = new JWTUtils(3);
                const activateToken = jwtUtils.generate({ id: user.id, action: JWTUtils.ACTIVATE_ACTION });
                const revokeToken = jwtUtils.generate({ id: user.id, action: JWTUtils.REVOKE_ACTION });
                const mailer = new Mailer();
                mailer.addModel(User.table(), user);
                mailer.addModel('urls', { activate: config.frontHost + '/activar/' + activateToken, revoke: config.frontHost + '/revocar/' + revokeToken });
                await mailer.sendEmail(config.email, user.email, userCommunications.welcome.emailSubject, userCommunications.welcome.emailHTMLBody);
                return response.success('Email Send Successfully');
            }
        } catch (error) {
            return response.error('An error ocurred while sending email \n' + error);
        }
    }

    async activate(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const tokenValue = req.params.token;
            const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verify(tokenValue);
            if (tokenVerification.success) {
                const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' FROM ' + Token.table() + ' WHERE token = ?', [tokenValue])
                if (tokenVerification.decoded.action !== JWTUtils.ACTIVATE_ACTION || !tokenResult || tokenResult.length === 0 || !tokenResult[0].active)
                    return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                if (!userResult || userResult.length === 0) {
                    return response.notFound('User not found');
                }
                const user = new User(userResult[0]);
                user.active = true;
                req.user = user;
                await this.query('UPDATE ' + User.table() + ' SET ? WHERE id = ?', [user, user.id]);
                tokenResult[0].active = false;
                await this.query('UPDATE ' + Token.table() + ' SET ? WHERE id = ?', [tokenResult[0], tokenResult[0].id]);
                return response.success('User active successfully');
            } else {
                return JWTUtils.processError(response, tokenVerification);
            }
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while activating user \n' + error);
        }
    }

    async refresh(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            if (!req.header(JWTUtils.USER_AUTH_HEADER)) {
                return response.badRequest('Not ' + JWTUtils.USER_AUTH_HEADER + ' header on request', HTMLResponse.MISSING_AUTH_STATUS);
            }
            const tokenValue = req.header(JWTUtils.USER_AUTH_HEADER).replace('Bearer ', '');
            const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verify(tokenValue);
            if (tokenVerification.success) {
                const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' FROM ' + Token.table() + ' WHERE token = ?', [tokenValue])
                if (tokenVerification.decoded.action !== JWTUtils.ACTIVATE_ACTION || !tokenResult || tokenResult.length === 0 || !tokenResult[0].active) {
                    return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                }
                if (!tokenResult[0].remember) {
                    return response.forbidden('The token can\'t be refreshed. Please, login again', HTMLResponse.NOT_AUTH_REFRESH_STATUS);
                }
                const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                if (!userResult || userResult.length === 0) {
                    return response.notFound('User not found');
                }
                const user = new User(userResult[0]);
                const jwtUtils = new JWTUtils();
                const tokenText = jwtUtils.generate(JWTUtils.getUserPayload(user));
                const token = new Token();
                token.token = tokenText;
                token.active = true;
                token.userId = user.id;
                this.query('INSERT into ' + Token.table() + ' SET ?', [token]);
                tokenResult[0].active = false;
                await this.query('UPDATE ' + Token.table() + ' SET ? WHERE id = ?', [tokenResult[0], tokenResult[0].id]);
                return response.success('Token refresh successfully', { user: user, access_token: token });
            } else {
                return JWTUtils.processError(response, tokenVerification);
            }
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while refreshing token \n' + error);
        }
    }

    async recoveryEmail(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const email = req.body.email;
            const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE email = ?', [email]);
            if (!userResult || userResult.length === 0) {
                return response.notFound('User not found.');
            }
            const user = new User(userResult[0]);
            const jwtUtils = new JWTUtils();
            const tokenText = jwtUtils.generate(JWTUtils.getUserPayload(user));
            const token = new Token();
            token.token = tokenText;
            token.active = true;
            token.userId = user.id;
            this.query('INSERT into ' + Token.table() + ' SET ?', [token]);
            const mailer = new Mailer();
            mailer.addModel(User.table(), user.toObject());
            mailer.addModel('urls', { recovery: config.frontHost + '/credenciales/' + tokenText });
            await mailer.sendEmail(config.email, user.email, userCommunications.recovery.emailSubject, userCommunications.recovery.emailHTMLBody);
            return response.success('Email Send Successfully');
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while sending email \n' + error);
        }
    }

    async recovery(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const tokenValue = req.params.token;
            const { password } = req.body;
            const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verify(tokenValue);
            if (tokenVerification.success) {
                const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' FROM ' + Token.table() + ' WHERE token = ?', [tokenValue])
                if (tokenVerification.decoded.action !== JWTUtils.RECOVERY_ACTION || !tokenResult || tokenResult.length === 0 || !tokenResult[0].active) {
                    return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                }
                const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                if (!userResult || userResult.length === 0) {
                    return response.notFound('User not found');
                }
                const user = new User(userResult[0]);
                if (!user.active) {
                    return response.unauthorized('The user is not active.', HTMLResponse.INACTIVE_USER_STATUS);
                }
                user.password = password;
                req.user = user;
                await this.query('UPDATE ' + User.table() + ' SET ? WHERE id = ?', [user, user.id]);
                tokenResult[0].active = false;
                await this.query('UPDATE ' + Token.table() + ' SET ? WHERE id = ?', [tokenResult[0], tokenResult[0].id]);
                return response.success('Password changed susccesfully');
            } else {
                return JWTUtils.processError(response, tokenVerification);
            }
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while recovery user \n' + error);
        }
    }

    async revoke(req, res) {
        const response = new HTMLResponse(req, res);
        try {
            const token = req.params.token;
            const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verify(token);
            if (tokenVerification.success) {
                const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' FROM ' + Token.table() + ' WHERE token = ?', [tokenValue])
                if (tokenVerification.decoded.action !== JWTUtils.REVOKE_ACTION || !tokenResult || tokenResult.length === 0 || !tokenResult[0].active) {
                    return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                }
                const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' FROM ' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                if (!userResult || userResult.length === 0) {
                    return response.notFound('User not found');
                }
                const user = new User(userResult[0]);
                if (user.active) {
                    return response.conflict('The user is already activated', HTMLResponse.ALREADY_ACTIVE_STATUS);
                } else {
                    const deleteResult = await this.query('DELETE FROM ' + User.table() + ' WHERE id = ?', user.id)
                    tokenResult[0].active = false;
                    await this.query('UPDATE ' + Token.table() + ' SET ? WHERE id = ?', [tokenResult[0], tokenResult[0].id]);
                    return response.success('User deleted successfully');
                }
            } else {
                return JWTUtils.processError(response, tokenVerification);
            }
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while deleting user \n' + error);
        }
    }

}
