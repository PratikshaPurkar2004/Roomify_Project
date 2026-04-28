const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// GET all rooms with host details (for finders)
router.get("/", async (req, res) => {
  try {
    const [rooms] = await db.query(`
      SELECT r.*, u.name as host_name, u.email as host_email 
      FROM rooms r 
      JOIN users u ON r.host_id = u.user_id 
      WHERE r.availability = 'available'
    `);
    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error("Fetch all rooms error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET a single room by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rooms] = await db.query(`
      SELECT r.*, u.name as host_name, u.email as host_email
      FROM rooms r 
      JOIN users u ON r.host_id = u.user_id 
      WHERE r.room_id = ?
    `, [id]);
    
    if (rooms.length > 0) {
      res.json({ success: true, room: rooms[0] });
    } else {
      res.status(404).json({ success: false, message: "Room not found" });
    }
  } catch (error) {
    console.error("Fetch room detail error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// GET rooms for a specific host
router.get("/host/:hostId", async (req, res) => {
  const { hostId } = req.params;
  try {
    const [rooms] = await db.query("SELECT * FROM rooms WHERE host_id = ?", [hostId]);
    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error("Fetch host rooms error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// POST to add a new room with multiple images
router.post("/add", upload.array("images", 5), async (req, res) => {
  const { host_id, location, address, state, country, rent, max_tenants, required_tenants, property_type, furnishing, amenities } = req.body;
  
  // Handle multiple images
  let image_url = null;
  if (req.files && req.files.length > 0) {
    const paths = req.files.map(file => `/uploads/${file.filename}`);
    image_url = JSON.stringify(paths);
  }


  if (!host_id || !location || !rent) {
    return res.status(400).json({ success: false, message: "Please provide all required fields (host_id, location, rent)" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO rooms (host_id, location, address, state, country, rent, max_tenants, required_tenants, property_type, furnishing, amenities, availability, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?)",
      [host_id, location, address, state || null, country || null, rent, max_tenants || 1, required_tenants || 1, property_type || null, furnishing || "Unfurnished", amenities || "", image_url]
    );

    res.json({
      success: true,
      message: "Room added successfully!",
      roomId: result.insertId,
      image_url: image_url
    });
  } catch (error) {
    console.error("Add room error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// DELETE a room
router.delete("/delete/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const [result] = await db.query("DELETE FROM rooms WHERE room_id = ?", [roomId]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Room deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Room not found" });
    }
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// UPDATE a room (Edit)
router.put("/edit/:roomId", upload.array("images", 5), async (req, res) => {
  const { roomId } = req.params;
  const { location, address, rent, availability, max_tenants, furnishing, amenities } = req.body;


  try {
    let query = "UPDATE rooms SET location = ?, address = ?, rent = ?, availability = ?, max_tenants = ?, furnishing = ?, amenities = ?";
    let params = [location, address, rent, availability, max_tenants, furnishing, amenities];

    if (req.files && req.files.length > 0) {
      const paths = req.files.map(file => `/uploads/${file.filename}`);
      const image_url = JSON.stringify(paths);
      query += ", image_url = ?";
      params.push(image_url);
    }


    query += " WHERE room_id = ?";
    params.push(roomId);

    const [result] = await db.query(query, params);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Room updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Room not found" });
    }
  } catch (error) {
    console.error("Edit room error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Log Room View
router.post("/:id/view", async (req, res) => {
  const roomId = req.params.id;
  const viewerId = req.body.viewerId;

  try {
    // Get host_id for this room
    const [rooms] = await db.query("SELECT host_id FROM rooms WHERE room_id = ?", [roomId]);
    if (rooms.length === 0) return res.status(404).json({ error: "Room not found" });
    
    const hostId = rooms[0].host_id;

    // Log the view
    await db.query("INSERT INTO views_log (user_id, viewer_id) VALUES (?, ?)", [hostId, viewerId || null]);
    
    res.json({ success: true });
  } catch (err) {
    console.error("View Log Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

