const db = require("../config/db");
const crypto = require("crypto");

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

    const token = crypto.randomBytes(32).toString("hex");

    // ⭐ SAVE TOKEN IN DATABASE
    await db.query(
      "UPDATE users SET reset_token = ? WHERE email = ?",
      [token, email]
    );

    res.json({
      message: "Reset link generated",
      token: token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { forgotPassword };