const HTMLCodes = require('./htmlCodes.output');
const Response  = require('./response.output');

class HTMLResponse {

    static get SUCCESS_STATUS(){
        return 'SUCCESS';
    };
    static get NOT_AUTH_REFRESH_STATUS() {
        return 'NOT_AUTH_REFRESH'
    };
    static get NOT_FOUND_STATUS() {
        return 'NOT_FOUND';
    };
    static get MALFORMED_TOKEN_STATUS() {
        return 'MALFORMED_TOKEN';
    };
    static get MISSING_AUTH_STATUS() {
        return 'MISSING_AUTHORIZATION_HEADER';
    };
    static get MISSING_API_KEY_STATUS(){
        return 'MISSING_API_KEY_HEADER';
    };
    static get EXPIRED_TOKEN_STATUS(){
        return 'EXPIRED_TOKEN';
    };
    static get WRONG_TOKEN_TYPE_STATUS(){
        return 'WRONG_TOKEN_TYPE';
    };
    static get INVALID_APP_TOKEN_STATUS(){
        return 'INVALID_APP_TOKEN';
    };
    static get VALIDATION_ERROR_STATUS(){
        return 'VALIDATION_ERROR';
    };
    static get ALREADY_EXISTS_STATUS(){
        return 'ALREADY_EXISTS';
    };
    static get ALREADY_ACTIVE_STATUS(){
        return 'ALREADY_ACTIVE';
    };
    static get INACTIVE_USER_STATUS() {
        return 'INACTIVE_USER';
    };
    static get UNAUTHORIZED_STATUS() {
        return 'UNAUTHORIZED';
    };
    static get INVALID_CREDENTIALS_STATUS() {
        return 'INVALID_CREDENTIALS';
    };
    static get SERVER_ERROR_STATUS() {
        return 'SERVER_ERROR';
    };
    static get TOO_MUCH_DATA_STATUS(){
        return 'TOO_MUCH_DATA_ERROR';
    };
    static get TOO_LESS_DATA_STATUS() {
        return 'TOO_LESS_DATA_ERROR';
    };
    static get INTEGRITY_DATA_STATUS() {
        return 'INTEGRITY_DATA_ERROR';
    };
    static get RESOURCE_ACCESS_DENIED_STATUS() {
        return 'RESOURCE_ACCESS_DENIED';
    };
    static get USER_PERMISSION_DENIED_STATUS() {
        return 'USER_PERMISSION_DENIED';
    };
    static get APP_PERMISSION_DENIED_STATUS() {
        return 'APP_PERMISSION_DENIED';
    };
    static get SCOPE_PERMISSION_DENIED_STATUS() {
        return 'SCOPE_DENIED';
    };
    static get DATABASE_ACCESS_DENIED_STATUS() {
        return 'DATABASE_ACCESS_DENIED';
    };
    static get NOT_IMPLEMENTED_STATUS() {
        return 'NOT_IMPLEMENTED';
    };
    static get USER_TEMPORARILY_BLOCKED_STATUS() {
        return 'USER_TEPORARILY_BLOCKED';
    };
    static get USER_BLOCKED_STATUS() {
        return 'USER_BLOCKED';
    };
    static get LOGIN_DENIED_STATUS() {
        return 'LOGIN_DENIED';
    };
    static get MISSING_DATA_STATUS() {
        return 'MISSING_DATA';
    };
    static get LIMIT_REACHED_STATUS() {
        'LIMIT_REACHED';
    };

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    sendFile(filePath) {
        return this.response.sendFile(filePath);
    }

    success(message, data) {
        return this.response.status(HTMLCodes.SUCCESS).send(Response.okResponse(HTMLCodes.SUCCESS, HTMLResponse.SUCCESS_STATUS, message, data));
    }

    badRequest(message, code, data) {
        return this.response.status(HTMLCodes.BAD_REQUEST).send(Response.errorResponse(HTMLCodes.BAD_REQUEST, code, message, data));
    }

    unauthorized(message, code, data) {
        return this.response.status(HTMLCodes.UNAUTHORIZED).send(Response.errorResponse(HTMLCodes.UNAUTHORIZED, code, message, data));
    }

    forbidden(message, code, data) {
        return this.response.status(HTMLCodes.FORBIDDEN).send(Response.errorResponse(HTMLCodes.FORBIDDEN, code, message, data));
    }

    notFound(message, data) {
        return this.response.status(HTMLCodes.NOT_FOUND).send(Response.errorResponse(HTMLCodes.NOT_FOUND, HTMLResponse.NOT_FOUND_STATUS, message, data));
    }

    conflict(message, code, data) {
        return this.response.status(HTMLCodes.CONFLICT).send(Response.errorResponse(HTMLCodes.CONFLICT, code, message, data));
    }

    error(message, data) {
        return this.response.status(HTMLCodes.SERVER_ERROR).send(Response.errorResponse(HTMLCodes.SERVER_ERROR, HTMLResponse.SERVER_ERROR_STATUS, message, data));
    }

    notImplemented(message, data) {
        return this.response.status(HTMLCodes.NOT_IMPLEMENTED).send(Response.errorResponse(HTMLCodes.NOT_IMPLEMENTED, HTMLResponse.NOT_IMPLEMENTED_STATUS, message, data));
    }

}
module.exports = HTMLResponse;