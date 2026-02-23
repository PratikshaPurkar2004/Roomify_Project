const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET Profile by user ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT name, age, area, budget, gender, photo, active FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.json(result[0]);
    }
  );
});

// UPDATE Profile
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { name, age, area, budget, gender, photo, active } = req.body;

  db.query(
    `UPDATE users 
     SET name=?, age=?, area=?, budget=?, gender=?, photo=?, active=? 
     WHERE id=?`,
    [name, age, area, budget, gender, photo, active, userId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Profile updated successfully" });
    }
  );
});

module.exports = router;