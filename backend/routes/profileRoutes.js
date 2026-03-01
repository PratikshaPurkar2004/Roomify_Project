// routes/profileRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET PROFILE
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT name, age_group, city, budget, gender FROM users WHERE user_id=?",
    [userId],
    (err, result) => {

      if (err) {
        console.log("GET ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(result[0]);
    }
  );
});

// UPDATE PROFILE
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { name, age_group, city, budget, gender } = req.body;

  db.query(
    `UPDATE users 
     SET name=?, age_group=?, city=?, budget=?, gender=? 
     WHERE user_id=?`,
    [name, age_group, city, budget, gender, userId],
    (err) => {

      if (err) {
        console.log("UPDATE ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Profile Updated Successfully" });
    }
  );
});

// DELETE ACCOUNT
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "DELETE FROM users WHERE user_id=?",
    [userId],
    (err) => {

      if (err) {
        console.log("DELETE ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Account Deleted Successfully" });
    }
  );
});

module.exports = router;