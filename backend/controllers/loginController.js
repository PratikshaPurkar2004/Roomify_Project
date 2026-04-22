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

    // Check if account is marked for deletion (deactivated)
    if (user.deletion_date) {
      const deletionDate = new Date(user.deletion_date);
      const now = new Date();
      const diffDays = Math.ceil((now - deletionDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 30) {
        // Reactivate account automatically on login
        await db.query("UPDATE users SET deletion_date = NULL WHERE user_id = ?", [user.user_id]);
        user.deletion_date = null;
        console.log(`Reactivated account for: ${user.email}`);
      } else {
        // Should have been deleted by background task
        return res.status(401).json({
          success: false,
          message: "Account permanently deleted"
        });
      }
    }

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