import nodeMailer from "./../../node_modules/nodemailer";

let MAIL_USER = "my-email@email.com";
let MAIL_PASSWORD = "email-password";
let MAIL_HOST = "smtp.gmail.com";
let MAIL_PORT = "587";

let adminEmail = MAIL_USER;
let adminPassword = MAIL_PASSWORD;
let mailHost = MAIL_HOST;
let mailPort = MAIL_PORT;

let sendMail = (to, subject, htmlContent) => {
    let transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false,
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    });
    let options = {
        from: adminEmail,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options); // This default return Promise
};

module.exports = sendMail;
