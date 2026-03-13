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
// GET Hosts and Finders
router.get("/users", (req, res) => {

  const hostsQuery = `
    SELECT name, email, city 
    FROM users 
    WHERE user_type = 'Host'
    LIMIT 5
  `;

  const findersQuery = `
    SELECT name, email, city 
    FROM users 
    WHERE user_type = 'Finder'
    LIMIT 5
  `;

  db.query(hostsQuery, (err, hosts) => {
    if (err) return res.status(500).json(err);

    db.query(findersQuery, (err, finders) => {
      if (err) return res.status(500).json(err);

      res.json({
        hosts,
        finders
      });
    });
  });

});

module.exports = router;