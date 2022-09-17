import HTMLResponse from '../output/htmlResponse.output'
import JWTUtils from '../utils/jwt.utils';
import { getConnection } from "../database/database";

export default class AppMiddlewares {

    static async authApp(req, res, next) {
        const jwtUtils = new JWTUtils();
        /*const Connection = await getConnection();
        const result = await Connection.query('Select id, scope, secret from app where Name = ?', 'SUSI');
        console.log(jwtUtils.generateApp(JWTUtils.getAppPayload(result)));*/
        const response = new HTMLResponse(req, res);
        if (!req.header(JWTUtils.APP_AUTH_HEADER)) {
            return response.badRequest('Not ' + JWTUtils.APP_AUTH_HEADER + ' header on request', HTMLResponse.MISSING_API_KEY_STATUS);
        }
        try {
            const token = req.header(JWTUtils.APP_AUTH_HEADER);
            //const jwtUtils = new JWTUtils();
            const tokenVerification = jwtUtils.verifyApp(token);
            if (tokenVerification.success || tokenVerification.reason === JWTUtils.EXPIRED_ERROR) {
                if (tokenVerification.decoded.type !== JWTUtils.APP_TOKEN)
                    return response.forbidden('Permission Denied. Wrong Token type', HTMLResponse.WRONG_TOKEN_TYPE_STATUS);
                req.appDecoded = tokenVerification.decoded;
            } else {
                return JWTUtils.processError(response, tokenVerification);
            }
            next();
        } catch (error) {
            return response.error('An error ocurred while trying to autenticate', error);
        }
    }

}