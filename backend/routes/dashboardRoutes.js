const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET Dashboard Stats
router.get("/stats", (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM rooms) AS rooms,
      (SELECT COUNT(*) FROM requests) AS requests
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Dashboard Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result[0]);
  });
});

module.exports = router;