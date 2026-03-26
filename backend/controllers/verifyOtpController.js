const db = require("../config/db");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = rows[0];

    if (user.reset_otp != otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (Date.now() > user.otp_expiry) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    res.json({
      message: "OTP verified"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = { verifyOtp };