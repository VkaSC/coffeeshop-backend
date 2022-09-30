const HTMLResponse = require('../output/htmlResponse.output');
const BaseController = require('../utils/base.controller');
const JWTUtils = require('../utils/jwt.utils');

class AppMiddlewares extends BaseController {

    async authApp(req, res, next) {
        const jwtUtils = new JWTUtils();
        /*const result = await this.query('Select id, scope, secret = require(app where name = ?', 'SUSI');
        console.log(jwtUtils.generateApp(JWTUtils.getAppPayload(result[0])));*/
        const response = new HTMLResponse(req, res);
        if (!req.header(JWTUtils.APP_AUTH_HEADER)) {
            return response.badRequest('Not ' + JWTUtils.APP_AUTH_HEADER + ' header on request', HTMLResponse.MISSING_API_KEY_STATUS);
        }
        try {
            const token = req.header(JWTUtils.APP_AUTH_HEADER);
            //const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verifyApp(token);
            if (tokenVerification.success || tokenVerification.reason === JWTUtils.EXPIRED_ERROR) {
                if (tokenVerification.decoded.type !== JWTUtils.APP_TOKEN){
                    return response.unauthorized('Permission Denied. Wrong Token type', HTMLResponse.WRONG_TOKEN_TYPE_STATUS);
                }
                const existingApp = await this.query('SELECT id = require(app WHERE id = ?', [tokenVerification.decoded.clientId]);
                if(!existingApp || existingApp.length === 0){
                    return response.unauthorized('Permission Denied. Unautorized application', HTMLResponse.UNAUTHORIZED_STATUS);
                }
                req.appDecoded = tokenVerification.decoded;
            } else {
                console.log(tokenVerification);
                return JWTUtils.processError(response, tokenVerification);
            }
            next();
        } catch (error) {
            console.log(error);
            return response.error('An error ocurred while trying to autenticate', error);
        }
    }

}
module.exports = AppMiddlewares;