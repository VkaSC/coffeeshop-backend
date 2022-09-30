const Token = require("../models/token.model");
const User = require("../models/user.model");
const HTMLResponse = require("../output/htmlResponse.output");
const BaseController = require("../utils/base.controller");
const JWTUtils = require("../utils/jwt.utils");

class UserMiddlewares extends BaseController {

    async authUser(req, res, next) {
        const response = new HTMLResponse(req, res);
        if (!req.header(JWTUtils.USER_AUTH_HEADER))
            return response.badRequest('Not ' + JWTUtils.USER_AUTH_HEADER + ' header on request', HTMLResponse.MISSING_AUTH_STATUS);
        try {
            const tokenValue = req.header(JWTUtils.USER_AUTH_HEADER).replace('Bearer ', '');
            const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verify(tokenValue);
            if (tokenVerification.success) {
                const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' = require(' + Token.table() + ' WHERE token = ?', [tokenValue])
                if (tokenVerification.decoded.action !== JWTUtils.APP_AUTH_ACTION || !tokenResult || tokenResult.length === 0 || !tokenResult[0].active) {
                    return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                }
                if (tokenVerification.decoded.type !== JWTUtils.USER_TOKEN) {
                    return response.forbidden('Permission Denied. Wrong Token type', HTMLResponse.WRONG_TOKEN_TYPE_STATUS);
                }
                const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' = require(' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                if (!userResult || userResult.length === 0) {
                    return response.notFound('User not found');
                }
                const user = new User(userResult[0]);
                if (!user.active) {
                    return response.unauthorized('The user is not active.', HTMLResponse.INACTIVE_USER_STATUS);
                }
                req.tokenDecoded = tokenVerification.decoded;
                req.user = user;
            } else {
                console.log(tokenVerification);
                return JWTUtils.processError(response, tokenVerification);
            }
            next()
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while trying to autenticate', error);
        }
    }

    async userData(req, res, next) {
        const response = new HTMLResponse(req, res);
        try {
            const tokenValue = req.header(JWTUtils.USER_AUTH_HEADER) ? req.header(JWTUtils.USER_AUTH_HEADER).replace('Bearer ', '') : undefined;
            if(tokenValue){
                const jwtUtils = new JWTUtils();
                const tokenVerification = jwtUtils.verify(tokenValue);
                if (tokenVerification.success) {
                    const tokenResult = await this.query('SELECT ' + Token.visibleFields().join(', ') + ' = require(' + Token.table() + ' WHERE token = ?', [tokenValue])
                    if (tokenVerification.decoded.action !== JWTUtils.APP_AUTH_ACTION || !tokenResult || tokenResult.length === 0 || !tokenResult[0].active) {
                        return response.forbidden('Permission Denied', HTMLResponse.USER_PERMISSION_DENIED_STATUS);
                    }
                    if (tokenVerification.decoded.type !== JWTUtils.USER_TOKEN) {
                        return response.forbidden('Permission Denied. Wrong Token type', HTMLResponse.WRONG_TOKEN_TYPE_STATUS);
                    }
                    const userResult = await this.query('SELECT ' + User.visibleFields().join(', ') + ' = require(' + User.table() + ' WHERE id = ?', [tokenVerification.decoded.id]);
                    if (!userResult || userResult.length === 0) {
                        return response.notFound('User not found');
                    }
                    const user = new User(userResult[0]);
                    if (!user.active) {
                        return response.unauthorized('The user is not active.', HTMLResponse.INACTIVE_USER_STATUS);
                    }
                    req.tokenDecoded = tokenVerification.decoded;
                    req.user = user;
                } else {
                    console.log(tokenVerification);
                    return JWTUtils.processError(response, tokenVerification);
                }   
            }
            next()
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while trying to autenticate', error);
        }
    }

}
module.exports = UserMiddlewares;