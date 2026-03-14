// routes/profileRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      name,
      age_group,
      city,
      budget,
      gender
    FROM users
    WHERE user_id = ?
  `;

  try {
    const [result] = await db.query(sql, [userId]);
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, age_group, city, budget, gender } = req.body;

  const userSql = `
    UPDATE users
    SET name=?, age_group=?, city=?, budget=?, gender=?
    WHERE user_id=?
  `;

  try {
    await db.query(userSql, [name, age_group, city, budget, gender, userId]);
    res.json({ message: "Profile Updated Successfully" });
  } catch (err) {
    console.log("USER UPDATE ERROR:", err);
    res.status(500).json({ message: "Server update error" });
  }
});


router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await db.query("DELETE FROM users WHERE user_id=?", [userId]);
    res.json({ message: "Account Deleted Successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
