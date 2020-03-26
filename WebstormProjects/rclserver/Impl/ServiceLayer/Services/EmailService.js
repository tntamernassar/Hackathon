let NodeMail = require('nodemailer');


let instance = undefined;

class EmailService{
    static getInstance() {
        if(instance === undefined)
            instance = new EmailService("tamer.nassar@intel.com", "********");

        return instance;
    };

    constructor(email, password){
        this.email = email;
        this.transporter = NodeMail.createTransport({
            host: 'outlook.intel.com',
            port:587,
            secureConnection:false,
            auth: {
                user: email,
                pass: password
            },
            tls:{
                ciphers:'SSLv3',
                rejectUnauthorized: false
            }
        });
    }


    createMailOption(to, subject, text, html){
        return  {
            from: this.email,
            to: to,
            subject: subject,
            text: text,
            html: html
        };
    }

    sendMail(mailOptions){
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    sendTextEmail(to, subject, body){
        this.sendMail(this.createMailOption(to, subject, body, ''));
    }

    sendHTMLEmail(to, subject, html){
        this.sendMail(this.createMailOption(to, subject, '', html));
    }
}




module.exports = EmailService;