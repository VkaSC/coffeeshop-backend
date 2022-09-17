import config from "./../config";
import jwt from "jsonwebtoken";
import HTMLResponse from "../output/htmlResponse.output";

export default class JWTUtils {

    // Token Type
    static APP_TOKEN = 'app-token';
    static USER_TOKEN = 'user-token';

    // Actions
    static APP_LOGGING_ACTION = 'app_logging';
    static ACTIVATE_ACTION = 'activate';
    static REVOKE_ACTION = 'revoke';
    static RECOVERY_ACTION = 'recovery';
    static CASE_STATUS_ACTION = 'case_status';

    // Header
    static USER_AUTH_HEADER = 'Authorization';
    static APP_AUTH_HEADER = 'api_key';

    // Errors
    static EXPIRED_ERROR = 'TokenExpiredError';
    static MALFOMED_ERROR = 'JsonWebTokenError';
    static UNKNOWN_ERROR = 'unknownError';

    constructor(expiresMultiply) {
        this.expiresMultiply = expiresMultiply || 1;
    }

    generate(payload) {
        return jwt.sign(payload, config.jwtSecret, { expiresIn: parseInt(config.tokenExpiration) * this.expiresMultiply });
    }

    generateApp(payload) {
        return jwt.sign(payload, config.jwtAppSecret, { expiresIn: parseInt(config.tokenExpiration) * this.expiresMultiply });
    }

    static getUserPayload(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            profile: user.profile,
            action: JWTUtils.APP_LOGGING_ACTION,
            type: JWTUtils.USER_TOKEN,
        }
    }

    static getAppPayload(authApp) {
        return {
            clientId: authApp.id,
            scope: authApp.scope,
            secret: authApp.secret,
            type: JWTUtils.APP_TOKEN
        }
    }

    verify(token) {
        const result = {
            success: false,
            reason: undefined,
            decoded: undefined,
            error: undefined,
        };
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            result.success = true;
            result.decoded = decoded;
        } catch (error) {
            if (error.name === JWTUtils.MALFOMED_ERROR || error.name === JWTUtils.EXPIRED_ERROR)
                result.reason = error.name;
            else
                result.reason = JWTUtils.UNKNOWN_ERROR;
            result.error = error;
        }
        return result;
    }

    verifyApp(token) {
        const result = {
            success: false,
            reason: undefined,
            decoded: undefined,
            error: undefined,
        };
        try {
            const decoded = jwt.verify(token, config.jwtAppSecret);
            result.success = true;
            result.decoded = decoded;
        } catch (error) {
            if (error.name === JWTUtils.EXPIRED_ERROR)
                result.decoded = jwt.decode(token, config.jwtAppSecret);
            if (error.name === JWTUtils.MALFOMED_ERROR || error.name === JWTUtils.EXPIRED_ERROR)
                result.reason = error.name;
            else
                result.reason = JWTUtils.UNKNOWN_ERROR;
            result.error = error;
        }
        return result;
    }

    static createRevokedToken(user, token, tokenVerification){
        return {
            token: token,
            user: user._id,
            issuedAt: new Date(tokenVerification.decoded.iat * 1000),
            expiredAt: new Date(tokenVerification.decoded.exp * 1000),
        }
    }

    static processError(response, tokenVerification) {
        if (tokenVerification.reason === JWTUtils.MALFOMED_ERROR)
            return response.badRequest('Malformed Token', HTMLResponse.MALFORMED_TOKEN_STATUS);
        else if (tokenVerification.reason === JWTUtils.EXPIRED_ERROR)
            return response.unauthorized('Token expired on ' + tokenVerification.error.expiredAt, HTMLResponse.EXPIRED_TOKEN_STATUS);
        else
            return response.error('An error ocurred while trying to autenticate', tokenVerification.error);
    }
}