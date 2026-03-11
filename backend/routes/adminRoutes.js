const express = require("express");
const router = express.Router();
// Controller se functions import ho rahe hain
const { adminLogin, adminSignup, forgotPassword } = require("../controllers/authController");

// --- ADMIN ROUTES ---

// Login Route
router.post("/login", adminLogin); 

// Signup Route
router.post("/signup", adminSignup);

// Forgot Password
router.post("/forgot-password", forgotPassword);

module.exports = router;