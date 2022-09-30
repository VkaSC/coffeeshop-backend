const nodemailer = require('nodemailer');
const TemplateProcessor = require('./templateProcessor');
const config = require("./../config");

class Mailer {


    constructor(service, user, password, sendHtml) {
        service = service || config.emailService;
        user = user || config.email;
        password = password || config.emailPassword;
        this.transporter = createTransporter(service, user, password);
        this.sendHtml = sendHtml || true;
        this.models = {};
    }

    addModel(modelName, model) {
        this.models[modelName] = model;
    }

    sendEmail(from, to, subject, body) {
        return new Promise((resolve, reject) => {
            try {
                subject = TemplateProcessor.merge(Array.isArray(subject) ? subject.join('\n') : subject, this.models);
                body = TemplateProcessor.merge(Array.isArray(body) ? body.join('\n') : body, this.models);
                let options = createOptions(from, Array.isArray(to) ? to.join(',') : to, subject, body, this.sendHtml);
                this.transporter.sendMail(options, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            } catch (error) { 
                reject(error) 
            }

        });
    }

}

function createTransporter(service, user, password) {
    return nodemailer.createTransport({
        service: service,
        host: "gmail.com",
        port: 465,
        auth: {
            user: user,
            pass: password,
        }
    });
}

function createOptions(from, to, subject, body, sendHtml) {
    if (sendHtml) {
        return {
            from: from,
            to: to,
            subject: subject,
            html: body
        }
    } else {
        return {
            from: from,
            to: to,
            subject: subject,
            text: body
        }
    }
}
module.exports = Mailer;