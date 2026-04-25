const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      name,
      age_group,
      area,
      DOB,
      occupation,
      area,
      budget,
      gender
    FROM users
    WHERE user_id = ?
  `;
  try {
    console.log("Fetching profile for userId:", userId);
    const [result] = await db.query(sql, [userId]);
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, dob, occupation, area, budget, gender } = req.body;
  const userId = req.params.id;
  const { name, age_group, area, DOB, dob, occupation, city, budget, gender } = req.body;
  const finalDob = DOB || dob;

  const userSql = `
    UPDATE users
    SET name=?, age_group=?, area=?, DOB=?, occupation=?, city=?, budget=?, gender=?
    WHERE user_id=?
  `;
  try {
    await db.query(userSql, [name, age_group, area, finalDob, occupation, city, budget, gender, userId]);
    res.json({ message: "Profile Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server update error" });
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
