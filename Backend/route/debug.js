// route/debug.js

function logRequest(req) {
    console.log('Incoming request body:', req.body);
  }
  
  function logAppointmentDetails(appointment) {
    console.log('Saved appointment details:', appointment);
  }
  
  function logMailOptions(mailOptions) {
    console.log('Mail options:', mailOptions);
  }
  
  function logEmailResult(error, info) {
    if (error) {
      console.error('Email sending error:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  }
  
  module.exports = {
    logRequest,
    logAppointmentDetails,
    logMailOptions,
    logEmailResult,
  };
  