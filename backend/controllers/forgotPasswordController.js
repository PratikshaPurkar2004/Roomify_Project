const db = require("../config/db");
const nodemailer = require("nodemailer");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 5 * 60 * 1000;

    // ✅ Save OTP
    await db.query(
      "UPDATE users SET reset_otp = ?, otp_expiry = ? WHERE email = ?",
      [otp, expiry, email]
    );

    // ✅ EMAIL SETUP (take values from .env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP is: ${otp}`
    });

    res.json({
      message: "OTP sent to email"
    });

  } catch (error) {
    console.error("Forgot Password Error:", error.message || error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        message: "Email authentication failed. Please check EMAIL_USER and EMAIL_PASS in .env"
      });
    }
    res.status(500).json({
      message: "Failed to send OTP. Please try again."
    });
  }
};

module.exports = { forgotPassword };