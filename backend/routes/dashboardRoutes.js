// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");

// // GET Dashboard Stats
// router.get("/stats", (req, res) => {
//   const sql = `
//     SELECT 
//       (SELECT COUNT(*) FROM users) AS users,
//       (SELECT COUNT(*) FROM rooms) AS rooms,
//       (SELECT COUNT(*) FROM requests) AS requests
//   `;

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("Dashboard Error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json(result[0]);
//   });
// });

// module.exports = router;

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
        (SELECT COUNT(*) FROM rooms) AS rooms,
        (SELECT COUNT(*) FROM requests WHERE receiver_id = ?) AS requests,
        (SELECT views FROM users WHERE user_id = ?) AS views,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Host') AS hosts,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Finder') AS finders
    `;
    params = [userId, userId];
  } else {
    sql = `
      SELECT 
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM rooms) AS rooms,
        (SELECT COUNT(*) FROM requests) AS requests,
        0 AS views,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Host') AS hosts,
        (SELECT COUNT(*) FROM users WHERE user_type = 'Finder') AS finders
    `;
  }

  try {
    console.log("Executing stats query...");
    const [result] = await db.query(sql, params);
    res.json(result[0] || { users: 0, rooms: 0, requests: 0, views: 0, hosts: 0, finders: 0 });
  } catch (err) {
    console.error("Dashboard Stats Error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});
// GET All Users
router.get("/users", async (req, res) => {
  try {
    console.log("Fetching users from database...");
    const [users] = await db.query(
      "SELECT user_id, name, email, area, user_type, preferences FROM users LIMIT 20"
    );
    console.log(`Retrieved ${users.length} users`);

    res.json({
      users
    });
  } catch (error) {
    console.error("Dashboard users error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
