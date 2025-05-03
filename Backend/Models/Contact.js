const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  problem: { type: String, required: true },
  status: { type: String, default: 'Pending' }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
