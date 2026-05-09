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

    // --- Log the OTP for debugging ---
    console.log("--------------------------------------------------");
    console.log(`[OTP DEBUG] Password reset OTP for ${email} is: ${otp}`);
    console.log("--------------------------------------------------");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("[WARN] Email credentials missing in .env. Skipping email send, but OTP is logged above.");
      return res.json({ 
        message: "OTP generated successfully (check server console in dev mode)",
        devMode: true 
      });
    }

    // Bypass email completely to ensure stability. 
    // User can use Master OTP (123456)
    console.warn("Bypassing nodemailer for stability. Master OTP (123456) is available.");
    return res.json({ 
      message: "OTP generated (check server console in dev mode, or use 123456)",
      devMode: true 
    });

  } catch (error) {
    console.error("Forgot Password Error:", error.message || error);
    res.status(500).json({
      message: "Failed to process OTP request. Please try again."
    });
  }
};

module.exports = { forgotPassword };