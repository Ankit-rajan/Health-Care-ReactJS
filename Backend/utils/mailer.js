require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Error verifying transporter:", error);
  } else {
    console.log("✅ Transporter is ready to send emails");
  }
});

module.exports = transporter; // ✅ Only export transporter
