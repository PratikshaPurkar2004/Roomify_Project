const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET PROFILE
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT name, age_group, city, budget, gender, preferences FROM users WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// UPDATE PROFILE
router.put("/:id", (req, res) => {
  const userId = req.params.id;

  const { name, age_group, city, budget, gender, preferences } = req.body;

  db.query(
    `UPDATE users
     SET name=?, age_group=?, city=?, budget=?, gender=?, preferences=?
     WHERE user_id=?`,
    [name, age_group, city, budget, gender, preferences, userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
});

// DELETE PROFILE
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "DELETE FROM users WHERE user_id=?",
    [userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});

module.exports = router;