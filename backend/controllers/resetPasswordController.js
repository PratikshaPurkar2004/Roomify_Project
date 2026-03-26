const db = require("../config/db");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, reset_otp = NULL, otp_expiry = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { resetPassword };