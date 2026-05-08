const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      user_id AS id,
      name,
      email,
      age_group,
      DOB,
      CASE 
        WHEN DOB IS NULL OR DOB > CURDATE() THEN NULL 
        ELSE TIMESTAMPDIFF(YEAR, DOB, CURDATE()) 
      END AS age,
      occupation,
      budget,
      gender,
      preferences,
      user_type,
      city,
      bio,
      phone
    FROM users
    WHERE user_id = ?
  `;
  try {
    console.log("Fetching profile for userId:", userId);
    
    // Log profile view if viewerId is provided
    const viewerId = req.query.viewerId;
    if (viewerId && String(viewerId) !== String(userId)) {
      try {
        await db.query(
          "INSERT INTO views_log (viewer_id, user_id) VALUES (?, ?)", 
          [viewerId, userId]
        );
      } catch (viewErr) {
        console.error("Error logging profile view:", viewErr);
      }
    }

    const [result] = await db.query(sql, [userId]);
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, occupation, city, budget, gender, DOB, dob } = req.body;
  const finalDob = DOB || dob || null;

  const userSql = `
    UPDATE users
    SET name=?, DOB=?, occupation=?, city=?, budget=?, gender=?
    WHERE user_id=?
  `;
  try {
    await db.query(userSql, [
      name || null, 
      finalDob, 
      occupation || null, 
      city || null, 
      budget || null, 
      gender || null, 
      userId
    ]);
    res.json({ success: true, message: "Profile Updated Successfully" });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ success: false, message: "Server update error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    // Instagram-like deletion: Mark for deletion (deactivate)
    // The account will be permanently deleted after 30 days by the background cleanup task.
    await db.query("UPDATE users SET deletion_date = CURRENT_TIMESTAMP WHERE user_id=?", [userId]);
    res.json({ message: "Account deactivated. It will be permanently deleted in 30 days. Log in before then to reactivate." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
