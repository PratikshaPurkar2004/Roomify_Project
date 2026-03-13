const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your mysql connection

// GET ALL USERS EXCEPT LOGGED USER
router.get("/all/:userId", (req, res) => {

  const userId = req.params.userId;

  const sql = "SELECT * FROM users WHERE user_id != ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result);
  });

});

module.exports = router;
