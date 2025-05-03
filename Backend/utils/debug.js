// debug.js

// Function to log incoming requests (e.g., appointment data)
const logRequest = (req) => {
    console.log('Request Body:', req.body);  // Log the incoming request body for the appointment
  };
  
  // Function to log appointment details (after saving to the database)
  const logAppointmentDetails = (newAppointment) => {
    console.log('New Appointment Details:', newAppointment);  // Log the saved appointment details
  };
  
  // Function to log mail options before sending the email
  const logMailOptions = (mailOptions) => {
    console.log('Mail Options:', mailOptions);  // Log email options to verify they're correct
  };
  
  // Function to log the result of sending the email (whether success or error)
  const logEmailResult = (error, info) => {
    if (error) {
      console.log('Error sending email:', error);  // Log email errors
    } else {
      console.log('Email sent: ' + info.response);  // Log email sent success response
    }
  };
  
  module.exports = { logRequest, logAppointmentDetails, logMailOptions, logEmailResult };
  