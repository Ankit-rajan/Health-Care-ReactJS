const express = require('express');
const Appointment = require('../Models/Appointment');
const router = express.Router();
const transporter = require('../utils/mailer');

// Assign Doctor
router.put('/appointments/assign/:id', async (req, res) => {
  const { doctorName, date, email } = req.body;
  
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctorName, date, email, status: 'Doctor Assigned' },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Send Email to User (Doctor Assigned)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Doctor Assigned to Your Appointment',
      text: `Dear ${updatedAppointment.name},

Good news! A doctor has been assigned to your case.

Doctor Name: ${doctorName}
Appointment Date: ${new Date(date).toLocaleString()}

Thank you for choosing our hospital.

Hospital Management Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send doctor assignment email:', error);
      } else {
        console.log('✅ Doctor assignment email sent:', info.response);
      }
    });

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign doctor' });
  }
});

// Endpoint to book a new appointment
router.post("/appointments", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.email || !req.body.problem) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new appointment from the incoming data
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();  // Save the appointment to the database

    // Prepare the email options for sending confirmation
    // Prepare the email options for sending confirmation
const appointmentDate = newAppointment.date ? new Date(newAppointment.date).toLocaleString() : 'Not scheduled yet';
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: newAppointment.email,
  subject: 'Your Appointment Has Been Confirmed',
  html: `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #0066cc;">Appointment Confirmation</h2>
          <p>Dear <strong>${newAppointment.name}</strong>,</p>
          
          <p>We are pleased to confirm that your appointment has been successfully booked. Below are the details:</p>
          
          <table style="width: 100%; margin-top: 15px; font-size: 0.95rem;">
            <tr><td style="padding: 8px 0;"><strong>Problem:</strong></td><td>${newAppointment.problem}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Doctor:</strong></td><td>${newAppointment.doctorName || 'Not assigned yet'}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${appointmentDate}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Time:</strong></td><td>${newAppointment.time || 'TBD'}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${newAppointment.phoneNumber}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Address:</strong></td><td>${newAppointment.address}</td></tr>
          </table>

          <p style="margin-top: 20px;">If you have any questions or need to make changes to your appointment, feel free to contact our support team.</p>

          <p>Thank you for trusting <strong>Health Center</strong> with your healthcare needs. We look forward to serving you.</p>

          <p style="margin-top: 30px;">Warm regards,</p>
          <p><strong>heath Care Management Team</strong></p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">
          <div style="text-align: center; font-size: 0.85rem; color: #999;">
            <p>&copy; ${new Date().getFullYear()} Health Center. All rights reserved.</p>
            <p><a href="http://www.healthcenter.com" style="color: #0066cc;">www.healthcenter.com</a> | 
               <a href="mailto:info@healthcenter.com" style="color: #0066cc;">info@healthcenter.com</a> | 
               +1 (234) 567-890</p>
          </div>
        </div>
      </body>
    </html>
  `
};


    // Send the email and handle success/error
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send email' });
      }

      res.status(201).json({ message: 'Appointment booked and confirmation email sent', appointment: newAppointment });
    });
  } catch (err) {
    console.log('Error in booking appointment:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET all appointments (for admin panel)
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// DELETE appointment
router.delete('/admin/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
});

// PUT: update appointment
router.put('/admin/appointments/:id', async (req, res) => {
  try {
    const { name, address, phoneNumber, problem, doctorName, date, email } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { name, address, phoneNumber, problem, doctorName, date, email },
      { new: true }
    );

    // Optional: Send updated email here
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
});


// GET latest appointment for a user based on email
router.get('/user/appointments/latest', async (req, res) => {
  const { email } = req.query;

  try {
    const latestAppointment = await Appointment.findOne({ email }).sort({ createdAt: -1 });

    if (!latestAppointment) {
      return res.status(404).json({ message: 'No appointment found for this email.' });
    }

    res.status(200).json(latestAppointment);
  } catch (error) {
    console.error('Error fetching latest appointment:', error);
    res.status(500).json({ message: 'Server error while fetching appointment' });
  }
});



module.exports = router;
