// ./models/AdminLogin.js

const mongoose = require('mongoose');

const adminLoginSchema = new mongoose.Schema({
  email: String,
  password: String
});

module.exports = mongoose.model('AdminLogin', adminLoginSchema);
