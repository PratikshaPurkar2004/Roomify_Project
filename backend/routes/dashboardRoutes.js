const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/stats", async (req, res) => {
  const userId = req.query.userId;
  let sql;
  let params = [];

  if (userId) {
    sql = `
      SELECT 
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM rooms) AS total_rooms,
        (SELECT COUNT(*) FROM rooms WHERE host_id = ?) AS rooms,
        (SELECT COUNT(*) FROM requests WHERE receiver_id = ?) AS requests,
        (SELECT COUNT(*) FROM views_log WHERE user_id = ?) AS views,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Host') AS hosts,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Finder') AS finders,
        (SELECT COUNT(*) FROM requests WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted') AS matches
    `;
    params = [userId, userId, userId, userId, userId];
  } else {
    sql = `
      SELECT 
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM rooms) AS total_rooms,
        (SELECT COUNT(*) FROM rooms) AS rooms,
        (SELECT COUNT(*) FROM requests) AS requests,
        (SELECT COUNT(*) FROM views_log) AS views,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Host') AS hosts,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Finder') AS finders,
        (SELECT COUNT(*) FROM requests WHERE status = 'accepted') AS matches
    `;
  }


  try {
    console.log("Executing stats query...");
    const [result] = await db.query(sql, params);
    res.json(result[0] || { users: 0, rooms: 0, requests: 0, views: 0, hosts: 0, finders: 0, matches: 0 });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    console.log("Fetching users from database...");
    const [users] = await db.query(
      "SELECT user_id, name, email, area, user_type, preferences FROM users LIMIT 20"
    );
    res.json({ users });
  } catch (error) {
    console.error("Dashboard users error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET Daily Graph Data
router.get("/graph-data", async (req, res) => {
  const userId = req.query.userId;
  let sql;
  let params = [];

  sql = `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m-%d') as date,
      COUNT(*) as requests,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as matches,
      (SELECT COUNT(*) FROM views_log v WHERE DATE_FORMAT(v.created_at, '%Y-%m-%d') = DATE_FORMAT(r.created_at, '%Y-%m-%d') ${userId ? 'AND v.user_id = ?' : ''}) as views
    FROM requests r
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ${userId ? 'AND (sender_id = ? OR receiver_id = ?)' : ''}
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
    ORDER BY date ASC
  `;

  if (userId) params = [userId, userId, userId];


  try {
    const [rows] = await db.query(sql, params);
    
    // Map dates to day names (Mon, Tue, etc.)
    const formattedData = rows.map(row => {
      const date = new Date(row.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        name: dayName,
        date: row.date,
        requests: row.requests,
        matches: parseInt(row.matches || 0)
      };

    });

    res.json(formattedData);
  } catch (err) {
    console.error("Dashboard Graph Error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

module.exports = router;
