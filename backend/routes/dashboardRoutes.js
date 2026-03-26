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
        (SELECT COUNT(*) FROM requests WHERE receiver_id = ?) AS requests
    `;
    params = [userId];
  } else {
    sql = `
      SELECT 
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM rooms) AS rooms,
        (SELECT COUNT(*) FROM requests) AS requests
    `;
  }

  try {
    const [result] = await db.query(sql, params);
    res.json(result[0] || { users: 0, rooms: 0, requests: 0 });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});
// GET All Users
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT name, email, city, user_type, preferences FROM users LIMIT 20"
    );

    res.json({
      users
    });
  } catch (error) {
    console.error("Dashboard users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
