// const express = require('express');
// const router = express.Router();
// const Appointment = require('../Models/Appointment'); // Make sure this path matches
// const transporter = require('../utils/mailer'); // ⬅️ Make sure this path is correct

// // Get all appointments
// router.get('/appointments', async (req, res) => {
//   try {
//     const appointments = await Appointment.find();
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch appointments' });
//   }
// });

// // Approve appointment
// router.put('/appointments/approve/:id', async (req, res) => {
//   try {
//     const updated = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status: 'Approved' },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to approve appointment' });
//   }
// });

// // Reject appointment
// router.put('/appointments/reject/:id', async (req, res) => {
//   try {
//     const updated = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { status: 'Rejected' },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to reject appointment' });
//   }
// });

// // Assign doctor

// // Assign Doctor
// router.put('/appointments/assign/:id', async (req, res) => {
//   const { doctorName, date } = req.body;

//   try {
//     // Find and update the appointment
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { doctorName, date, status: 'Doctor Assigned' },
//       { new: true }
//     );

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     // Get the user's email from the updated appointment
//     const userEmail = updatedAppointment.email;

//     // Send Email to User (Doctor Assigned)
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: userEmail,  // Using the email from the appointment record
//       subject: 'Doctor Assigned to Your Appointment',
//       text: `Dear ${updatedAppointment.name},

// Good news! A doctor has been assigned to your case.

// Doctor Name: ${doctorName}
// Appointment Date: ${new Date(date).toLocaleString()}

// Thank you for choosing our hospital.

// Hospital Management Team`
//     };

//     // Send the email to the user
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('❌ Failed to send doctor assignment email:', error);
//         return res.status(500).json({ message: 'Failed to send doctor assignment email' });
//       } else {
//         console.log('✅ Doctor assignment email sent:', info.response);
//       }
//     });

//     // Respond with the updated appointment details
//     res.json(updatedAppointment);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to assign doctor' });
//   }
// });


// module.exports = router;










const express = require('express');
const router = express.Router();
const Appointment = require('../Models/Appointment'); // Make sure this path matches
const transporter = require('../utils/mailer'); // ⬅️ Make sure this path is correct

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Approve appointment
router.put('/appointments/approve/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve appointment' });
  }
});

// Reject appointment
router.put('/appointments/reject/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject appointment' });
  }
});

// Assign Doctor
router.put('/appointments/assign/:id', async (req, res) => {
  const { doctorName, date } = req.body;

  try {
    // Find and update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctorName, date, status: 'Doctor Assigned' },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Get the user's email from the updated appointment
    const userEmail = updatedAppointment.email;

    // Send Email to User (Doctor Assigned)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,  // Using the email from the appointment record
      subject: 'Doctor Assigned to Your Appointment',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1; border-radius: 8px; background-color: #f9f9f9;">
              <h2 style="color: #0066cc;">Appointment Update</h2>
              <p>Dear ${updatedAppointment.name},</p>
              
              <p>We are pleased to inform you that a doctor has been successfully assigned to your upcoming appointment. Below are the details:</p>
              
              <ul style="line-height: 1.8;">
                <li><strong>Doctor Name:</strong> ${doctorName}</li>
                <li><strong>Appointment Date:</strong> ${new Date(date).toLocaleString()}</li>
              </ul>
              
              <p>Thank you for choosing our hospital for your healthcare needs. Our team is committed to providing you with the best care possible.</p>
              
              <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>
              
              <p>Best Regards,</p>
              <p><strong>Heath Care Management Team</strong></p>
              
              <hr style="border: 1px solid #e1e1e1;">
              <div style="text-align: center; font-size: 0.9rem; color: #999;">
                <p>&copy; ${new Date().getFullYear()} Health Center. All Rights Reserved.</p>
                <p>Contact Us: <a href="mailto:info@healthcenter.com" style="color: #0066cc;">info@healthcenter.com</a> | <a href="tel:+1234567890" style="color: #0066cc;">+1 (234) 567-890</a></p>
                <p><a href="http://www.healthcenter.com" style="color: #0066cc;">www.healthcenter.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Send the email to the user
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send doctor assignment email:', error);
        return res.status(500).json({ message: 'Failed to send doctor assignment email' });
      } else {
        console.log('✅ Doctor assignment email sent:', info.response);
      }
    });

    // Respond with the updated appointment details
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign doctor' });
  }
});

module.exports = router;

