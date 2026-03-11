const Admin = require("../models/Admin");
const User = require("../models/User");
const Issue = require("../models/Issue");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Token generator function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });
};

// --- USER PROFILE ---
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Check if valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const activeIssues = await Issue.find({ userId: id, status: "Issued" }).populate("bookId"); 

    const formattedBooks = activeIssues.map(issue => ({
      title: issue.bookId ? issue.bookId.title : "Book Data Missing",
      issueDate: issue.issueDate,
      status: issue.status,
      _id: issue._id
    }));

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      totalFine: user.totalFine || 0,
      books: formattedBooks,
      membershipExpiry: user.membershipExpiry
    });
  } catch (error) {
    next(error); 
  }
};

// --- USER SIGNUP ---
const userSignup = async (req, res, next) => {
  try {
    const { email, password, name, membershipType, membershipExpiry } = req.body;

    // 1. Check karo ki user pehle se hai kya?
    let user = await User.findOne({ email });

    if (user) {
      // ✅ CASE 1: Agar user mil gaya, toh sirf Membership update karo
      // Error dene ki jagah hum data update kar rahe hain
      user.membershipType = membershipType || user.membershipType;
      user.membershipExpiry = membershipExpiry || user.membershipExpiry;
      
      // Agar admin ne naam change kiya hai toh wo bhi update ho jayega
      if (name) user.name = name;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Membership Updated Successfully 🎉",
        user: { _id: user._id, name: user.name, email: user.email }
      });
    }

    // ✅ CASE 2: Agar user nahi mila, toh Naya User banao
    // Note: Naye user ke liye password zaroori hota hai
    const newUser = new User({ 
      email, 
      password: password || "123456", // Default password agar admin side se password nahi aa raha
      name, 
      membershipType, 
      membershipExpiry 
    });

    await newUser.save(); 

    const token = generateToken(newUser._id);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: token,
      user: { _id: newUser._id, name: newUser.name, email: newUser.email } 
    });

  } catch (error) {
    next(error);
  }
};
// --- USER LOGIN ---
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // 💡 FIX: User model mein tune 'matchPassword' banaya hai, wahi use karna best hai
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({ 
        success: true,
        message: "User Login Successful",
        token: token, 
        role: "user",
        user: { _id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin }
      });
    } else {
      res.status(401).json({ message: "Invalid User credentials" });
    }
  } catch (error) {
    next(error);
  }
};

// --- ADMIN SIGNUP ---
const adminSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });
    
    const admin = new Admin({ email, password });
    await admin.save();
    
    res.status(201).json({ 
      success: true,
      message: "Admin Registered Successfully", 
      token: generateToken(admin._id),
      role: "admin"
    });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN LOGIN ---
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    // 💡 FIX: Admin model mein bhi check karna ki matchPassword method hai ya nahi
    // Agar nahi hai toh bcrypt.compare use karna sahi hai
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({ 
        success: true,
        message: "Admin Login Successful 🚀",
        token: generateToken(admin._id),
        role: "admin",
        user: { _id: admin._id, email: admin.email, isAdmin: true }
      });
    } else {
      res.status(401).json({ message: "Invalid Admin credentials" });
    }
  } catch (error) {
    next(error);
  }
};

// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const account = (await User.findOne({ email })) || (await Admin.findOne({ email }));

    if (!account) {
      return res.status(404).json({ message: "Email not found!" });
    }
    res.json({ message: "Password reset link sent!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { adminLogin, userLogin, adminSignup, userSignup, forgotPassword, getUserProfile };