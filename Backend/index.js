// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Initialize Express App
const app = express();
const port = 4000;

// Middleware Setup
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use("/UserUploads", express.static(path.join(__dirname, "UserUploads"))); // Serve static files

// Connect to MongoDB Database
mongoose
  .connect("mongodb://127.0.0.1:27017/HospitalManagement",
  //    {
  //   // useNewUrlParser: true,
  //   // useUnifiedTopology: true,
  // }
)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Multer configuration for file uploads
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "UserUploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadUser = multer({ storage: userStorage });

// Import Models
const User = require("./Models/User");
const Contact = require("./Models/Contact");
const Appointment = require("./Models/Appointment");

// Import Utilities
require("./utils/mailer");

// Import Routes
const appointmentRoutes = require("./route/appointment");
const adminAppointmentRoutes = require("./route/adminAppointment");

// Use Routes
app.use("/admin", adminAppointmentRoutes); // Admin Appointment routes
app.use("/", appointmentRoutes);           // General appointment routes

// ========================== User Routes ==========================

// User Registration
app.post("/api/signup", uploadUser.single("image"), async (req, res) => {
  const { name, username, email, password, phoneNumber, address } = req.body;
  const image = req.file ? "/UserUploads/" + req.file.filename : null;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const newUser = await User.create({
      name,
      username,
      email,
      password,
      phoneNumber,
      address,
      image,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================== Contact Routes ==========================

// Submit Contact Form
app.post("/api/contact", async (req, res) => {
  const { name, email, problem } = req.body;
  try {
    const newContact = new Contact({ name, email, problem });
    await newContact.save();
    res.status(201).json({ message: "Contact form submitted", contact: newContact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================== Admin User Routes ==========================

// Get All Users
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New User
app.post("/admin/user/add", uploadUser.single("image"), async (req, res) => {
  const { name, email, phoneNumber, address } = req.body;
  const image = req.file ? "/UserUploads/" + req.file.filename : null;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    const newUser = await User.create({ name, email, phoneNumber, address, image });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete User
app.delete("/admin/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User
app.put("/admin/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================== Admin Contact Routes ==========================

// Get All Contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve Contact
app.put("/contacts/approve/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    contact.status = "Approved";
    const updated = await contact.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject Contact
app.put("/contacts/reject/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    contact.status = "Rejected";
    const updated = await contact.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================== Server Start ==========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
