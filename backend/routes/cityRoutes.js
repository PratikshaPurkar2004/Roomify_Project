const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET popular cities from rooms and users tables
router.get('/', async (req, res) => {
  try {
    // Get distinct cities from rooms (locations where rooms exist)
    const [roomLocations] = await db.query(`
      SELECT DISTINCT location AS city 
      FROM rooms 
      WHERE location IS NOT NULL AND location != ''
    `);

    let cities = roomLocations.map(row => row.city);

    // If there are fewer than 4 cities, we can append static popular cities to have a nice UI
    const defaultCities = ['Mumbai', 'Pune', 'Nashik', 'Hyderabad', 'Bangalore', 'Delhi'];
    
    // Fill up the list if not enough dynamic cities
    for (const city of defaultCities) {
      if (!cities.includes(city)) {
        cities.push(city);
      }
    }

    // Return exactly 4 cities for the popular cities grid by default, or all if ?all=true
    const isAll = req.query.all === 'true';
    res.json({
      success: true,
      cities: isAll ? cities : cities.slice(0, 4)
    });

  } catch (error) {
    console.error("Fetch cities error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
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
