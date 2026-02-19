const express = require("express");
const { adminLogin, userLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/user/login", userLogin);

module.exports = router;
