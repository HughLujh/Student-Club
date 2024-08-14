const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET
  }
});


async function sendEmail(sender, receivers, subject, text, _name = 'System Admin') {
  let from = { name: _name, address: 'langen2023@gmail.com' };
  for (let i = 0; i < receivers.length; i++) {
    const receiver = receivers[i];

    let mailOptions = {
      from: from,
      replyTo: sender,
      to: receiver,
      subject: subject,
      text: text
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email is sent successfully");
    } catch (err) {
      console.log("Failed to send email to " + receiver);
      console.log(err);
    }
  }
}

module.exports = sendEmail;
