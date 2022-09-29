import HTMLCodes from './htmlCodes.output';
import Response  from './response.output';

export default class HTMLResponse {

    static SUCCESS_STATUS = 'SUCCESS';
    static NOT_AUTH_REFRESH_STATUS = 'NOT_AUTH_REFRESH';
    static NOT_FOUND_STATUS = 'NOT_FOUND';
    static MALFORMED_TOKEN_STATUS = 'MALFORMED_TOKEN';
    static MISSING_AUTH_STATUS = 'MISSING_AUTHORIZATION_HEADER';
    static MISSING_API_KEY_STATUS = 'MISSING_API_KEY_HEADER';
    static EXPIRED_TOKEN_STATUS = 'EXPIRED_TOKEN';
    static WRONG_TOKEN_TYPE_STATUS = 'WRONG_TOKEN_TYPE';
    static INVALID_APP_TOKEN_STATUS = 'INVALID_APP_TOKEN';
    static VALIDATION_ERROR_STATUS = 'VALIDATION_ERROR';
    static ALREADY_EXISTS_STATUS = 'ALREADY_EXISTS';
    static ALREADY_ACTIVE_STATUS = 'ALREADY_ACTIVE';
    static INACTIVE_USER_STATUS = 'INACTIVE_USER';
    static UNAUTHORIZED_STATUS = 'UNAUTHORIZED';
    static INVALID_CREDENTIALS_STATUS = 'INVALID_CREDENTIALS';
    static SERVER_ERROR_STATUS = 'SERVER_ERROR';
    static TOO_MUCH_DATA_STATUS = 'TOO_MUCH_DATA_ERROR';
    static TOO_LESS_DATA_STATUS = 'TOO_LESS_DATA_ERROR';
    static INTEGRITY_DATA_STATUS = 'INTEGRITY_DATA_ERROR';
    static RESOURCE_ACCESS_DENIED_STATUS = 'RESOURCE_ACCESS_DENIED';
    static USER_PERMISSION_DENIED_STATUS = 'USER_PERMISSION_DENIED';
    static APP_PERMISSION_DENIED_STATUS = 'APP_PERMISSION_DENIED';
    static SCOPE_PERMISSION_DENIED_STATUS = 'SCOPE_DENIED';
    static DATABASE_ACCESS_DENIED_STATUS = 'DATABASE_ACCESS_DENIED';
    static NOT_IMPLEMENTED_STATUS = 'NOT_IMPLEMENTED';
    static USER_TEMPORARILY_BLOCKED_STATUS = 'USER_TEPORARILY_BLOCKED';
    static USER_BLOCKED_STATUS = 'USER_BLOCKED';
    static LOGIN_DENIED_STATUS = 'LOGIN_DENIED';
    static MISSING_DATA_STATUS = 'MISSING_DATA';
    static LIMIT_REACHED_STATUS = 'LIMIT_REACHED';

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