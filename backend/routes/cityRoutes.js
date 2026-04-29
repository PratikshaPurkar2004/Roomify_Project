const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Mock city data as requested by the frontend
router.get("/", (req, res) => {
  const cities = ["Mumbai", "Pune", "Nashik", "Hyderabad", "Bangalore", "Delhi"];
  res.json({
    success: true,
    cities: cities
  });
});

// GET all unique cities from both rooms and users
router.get('/all', async (req, res) => {
  try {
    const [roomCities] = await db.query("SELECT DISTINCT location FROM rooms");
    const [userCities] = await db.query("SELECT DISTINCT city FROM users");
    
    // Process roomCities slightly because they might be 'Area, City'
    const cleanRoomCities = roomCities.map(r => {
      const parts = r.location.split(',');
      return parts[parts.length - 1].trim();
    });

    const combined = new Set([
      ...cleanRoomCities,
      ...userCities.map(u => u.city).filter(Boolean),
      'Mumbai', 'Pune', 'Nashik', 'Hyderabad', 'Bangalore', 'Delhi'
    ]);

    res.json({
      success: true,
      cities: Array.from(combined).sort()
    });
  } catch (error) {
    console.error("Fetch all cities error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});


// GET all states
router.get('/states', (req, res) => {
  const states = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Gujarat', 
    'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Punjab'
  ];
  res.json({ success: true, states });
});

// GET countries
router.get('/countries', (req, res) => {
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia'];
  res.json({ success: true, countries });
});

module.exports = router;
