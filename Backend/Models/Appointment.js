
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  problem: { type: String, required: true },
  doctorName: { type: String, default: null },
  date: { type: Date, default: null },
  email: { type: String, required: true },
  status: { type: String, default: 'Pending' },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
