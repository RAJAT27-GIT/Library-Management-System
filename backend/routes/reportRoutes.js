// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { getReports } = require("../controllers/reportController");

// 👈 Yahan sirf "/" rakho kyunki "/api/reports" server.js se aa raha hai
router.get("/", getReports); 
module.exports = router;