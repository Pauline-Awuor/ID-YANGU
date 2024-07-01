const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_PORT = process.env.SMTP_PORT;

async function sendMail(email, subject, html) {
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD },
    });
    await transport.sendMail({
      from: `FYND ${SMTP_EMAIL}`,
      to: email,
      subject,
      html,
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports = sendMail;
