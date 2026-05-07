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

    try {
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
    } catch (mailError) {
      console.error("Email sending failed, but OTP was generated:", mailError.message || mailError);
      return res.json({ 
        message: "OTP generated (Email failed, check server console)",
        devMode: true 
      });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error.message || error);
    res.status(500).json({
      message: "Failed to process OTP request. Please try again."
    });
  }
};

module.exports = { forgotPassword };