const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Issue = require("../models/Issue"); 
// Controller se functions import ho rahe hain
const { userLogin, userSignup, getUserProfile, forgotPassword } = require("../controllers/authController");

// --- AUTH ROUTES ---
router.post("/signup", userSignup); 
router.post("/login", userLogin);   
router.post("/forgot-password", forgotPassword);

// --- FINE CLEAR ROUTE ---
router.post("/clear-fine/:id", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { totalFine: 0 });
    res.json({ message: "Fine cleared successfully" });
  } catch (err) {
    next(err); 
  }
});

// --- 🟢 USER PROFILE ROUTE ---
// Bhai, yahan Controller wala function use karo taaki 'next' sahi se kaam kare
router.get("/profile/:id", getUserProfile); 

// --- MANAGEMENT ROUTES ---
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) { 
    next(err); 
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted Successfully" });
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;