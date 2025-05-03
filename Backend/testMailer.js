// testMailer.js
const transporter = require('./utils/mailer');  // Adjust path if needed

const mailOptions = {
  from: process.env.EMAIL_USER,  // Sender's email (from .env)
  to: 'karanchouhan9409@gmail.com',  // Replace with actual recipient's email
  subject: 'Test Email from Node.js',
  text: 'This is a test email sent from Node.js using Nodemailer.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
