const config = require("./../config");
const jwt = require("jsonwebtoken");
const HTMLResponse = require("../output/htmlResponse.output");

class JWTUtils {

    // Token Type
    static get APP_TOKEN() {
        return 'app-token';
    };
    static get USER_TOKEN() {
        return 'user-token';
    };

    // Act getions
    static get APP_AUTH_ACTION() {
        return 'app_auth';
    };
    static get ACTIVATE_ACTION() {
        return 'activate';
    };
    static get REVOKE_ACTION() {
        return 'revoke';
    };
    static get RECOVERY_ACTION() {
        return 'recovery';
    };
    static get CREDENTIALS_ACTION() {
        return 'credentials';
    };

    // Hea getder
    static get USER_AUTH_HEADER() {
        return 'Authorization';
    };
    static get APP_AUTH_HEADER() {
        return 'api_key';
    };

    // Err getors
    static get EXPIRED_ERROR() {
        return 'TokenExpiredError';
    };
    static get MALFOMED_ERROR() {
        return 'JsonWebTokenError';
    };
    static get UNKNOWN_ERROR() {
        return 'unknownError';
    };

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
            action: JWTUtils.APP_AUTH_ACTION,
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

    static createRevokedToken(user, token, tokenVerification) {
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
module.exports = JWTUtils;