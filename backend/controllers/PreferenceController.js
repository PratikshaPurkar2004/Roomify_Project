const db = require("../config/db");

exports.savePreferences = async (req, res) => {
  try {
    const { userId, preferences } = req.body;

    // Save preferences as a comma-separated string in users.preferences
    const prefsString = Array.isArray(preferences) ? preferences.join(",") : "";

    const updateQuery = "UPDATE users SET preferences = ? WHERE user_id = ?";
    await db.query(updateQuery, [prefsString, userId]);

    return res.json({ message: "Preferences saved successfully" });
  } catch (err) {
    console.error("Preferences save error:", err);
    return res.status(500).json({ message: "Database error" });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sql = "SELECT preferences FROM users WHERE user_id = ?";
    const [rows] = await db.query(sql, [userId]);

    const prefsString = (rows[0] && rows[0].preferences) || "";
    return res.json({ preferences: prefsString });
  } catch (err) {
    console.error("Get preferences error:", err);
    return res.status(500).json({ message: "Database error" });
  }
};
