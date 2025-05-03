// Models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String }, // Change to type String
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("login_signups", UserSchema);
