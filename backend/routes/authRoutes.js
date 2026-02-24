// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");

const { forgotPassword } = require("../controllers/forgotPasswordController");
const { resetPassword } = require("../controllers/resetPasswordController");
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
module.exports = router;
