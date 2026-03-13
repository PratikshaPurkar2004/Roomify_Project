const express = require("express");
const router = express.Router();
const db = require("../config/db");

// controllers
const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");
const { forgotPassword } = require("../controllers/forgotPasswordController");
const { resetPassword } = require("../controllers/resetPasswordController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

module.exports = router;