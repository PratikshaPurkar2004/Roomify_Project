const express = require("express");
const router = express.Router();

// GET all cities
router.get("/", (req, res) => {
  res.json([
    { name: "Pune" },
    { name: "Mumbai" },
    { name: "Nagpur" },
    { name: "Delhi" },
    { name: "Bangalore" }
  ]);
});

module.exports = router;