const db = require("../config/db");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = rows[0];

    console.log("Login attempt:", { email: normalizedEmail, storedPasswordType: typeof user.password, storedPasswordLength: user.password ? user.password.length : 0 });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { login };