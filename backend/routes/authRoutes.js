const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");

router.post("/admin-login", async (req, res) => {
  const admin = await Admin.findOne(req.body);
  if (!admin) return res.json({ message: "Invalid Credentials" });
  res.json({ message: "Admin Login Successful" });
});

router.post("/user-login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.json({ message: "Invalid Credentials" });
  res.json({ message: "User Login Successful", user });
});

module.exports = router;
