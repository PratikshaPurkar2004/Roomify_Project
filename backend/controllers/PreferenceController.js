const db = require("../config/db");

exports.savePreferences = (req, res) => {

  const { userId, preferences } = req.body;

  const deleteQuery = "DELETE FROM user_preferences WHERE user_id = ?";

  db.query(deleteQuery, [userId], (err) => {

    if (err) {
      return res.status(500).json(err);
    }

    const insertQuery =
      "INSERT INTO user_preferences (user_id, preference_name) VALUES ?";

    const values = preferences.map((pref) => [userId, pref]);

    db.query(insertQuery, [values], (err2) => {

      if (err2) {
        return res.status(500).json(err2);
      }

      res.json({ message: "Preferences saved successfully" });

    });

  });

};