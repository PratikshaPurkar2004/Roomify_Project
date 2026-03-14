const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your mysql connection

// GET ALL USERS EXCEPT LOGGED USER
router.get("/all/:userId", async (req, res) => {

  const userId = req.params.userId;

  const sql = "SELECT * FROM users WHERE user_id != ?";

  try {
    const [result] = await db.query(sql, [userId]);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database error" });
  }

});

module.exports = router;
