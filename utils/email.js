const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name?.split(" ")[0] || "guest";
    this.url = url;
    this.from = `Dikshant Sharma <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // SendGrid SMTP configuration
      return nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: process.env.EMAIL_SENDGRID_PORT,
        auth: {
          user: "apikey", 
          pass: process.env.EMAIL_SENDGRID_API, 
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      };

      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      console.error("Email sending failed:", err);
    }
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Expense Tracker!");
  }
};
