const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_PORT = process.env.SMTP_PORT;

async function sendMail(email, subject, html) {
  console.log("sendMail function called");
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD },
    });
    await transport.sendMail({
      from: `Fynd ${SMTP_EMAIL}`,
      to: email,
      subject,
      html,
    });
  } catch (err) {
    console.log(err);
  }
}
//async function
async function sendIdNotFoundNotification(email, idNumber) {
  const subject = "ID Search Notification";
  const html = `
    <p>Dear User,</p>
    <p>Thank you for using our service. We regret to inform you that we could not find your ID card with the number <strong>${idNumber}</strong> at this time.</p>
    <p>We will notify you as soon as your ID card is found.</p>
    <p>Thank you for your patience.</p>
    <p>Best regards,<br>FYND Team</p>
  `;
  await sendMail(email, subject, html);
}

module.exports = { sendMail, sendIdNotFoundNotification };
