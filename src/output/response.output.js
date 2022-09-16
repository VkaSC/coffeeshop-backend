class Response {

    static okResponse(htmlCode, status, message, data, fieldsToRemove) {
        let postProcessedData = data;
        if (fieldsToRemove) {
            if (Array.isArray(fieldsToRemove)) {
                if(Array.isArray(postProcessedData)){
                    postProcessedData.forEach((element, index) => {
                        let postdata = element.toObject();
                        for (let field of fieldsToRemove) {
                            delete postdata[field];
                        }
                        postProcessedData[index] = postdata;
                    });
                } else {
                    postProcessedData = data.toObject();
                    for (let field of fieldsToRemove) {
                        delete postProcessedData[field];
                    }
                }
            } else {
                for (const fieldKey of Object.keys(fieldsToRemove)) {
                    let tmp = postProcessedData[fieldKey];
                    tmp = tmp.toObject();
                    for (let field of fieldsToRemove[fieldKey]) {
                        delete tmp[field];
                    }
                    postProcessedData[fieldKey] = tmp;
                }
            }
        }
        return {
            htmlCode: htmlCode,
            status: status,
            result: {
                message: message,
                data: postProcessedData
            }
        }
    }

    static errorResponse(htmlCode, status, message, errors) {
        let messagePreffix = '';
        if (htmlCode === 400)
            messagePreffix = 'Bad Request. ';
        if (htmlCode === 401)
            messagePreffix = 'Unauthorized. ';
        if (htmlCode === 403)
            messagePreffix = 'Forbiden. ';
        if (htmlCode === 404)
            messagePreffix = 'Not Found. ';
        if (htmlCode === 500)
            messagePreffix = 'Unexpected Error. ';
        return {
            htmlCode: htmlCode,
            status: status,
            result: {
                message: messagePreffix + message,
                errorInfo: errors,
            }
        }
    }
}
module.exports = Response;