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
      WHERE r.availability = 'available' AND u.deletion_date IS NULL
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

// POST to add a new room with image
router.post("/add", upload.single("image"), async (req, res) => {
  const { host_id, location, address, rent, max_tenants, furnishing, amenities } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!host_id || !location || !rent) {
    return res.status(400).json({ success: false, message: "Please provide all required fields (host_id, location, rent)" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO rooms (host_id, location, address, rent, max_tenants, furnishing, amenities, availability, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, 'available', ?)",
      [host_id, location, address, rent, max_tenants || 1, furnishing || "Unfurnished", amenities || "", image_url]
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
router.put("/edit/:roomId", upload.single("image"), async (req, res) => {
  const { roomId } = req.params;
  const { location, address, rent, availability, max_tenants, furnishing, amenities } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query = "UPDATE rooms SET location = ?, address = ?, rent = ?, availability = ?, max_tenants = ?, furnishing = ?, amenities = ?";
    let params = [location, address, rent, availability, max_tenants, furnishing, amenities];

    if (image_url) {
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

module.exports = router;
