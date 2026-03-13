const express = require("express");
const router = express.Router();

const { savePreferences, getPreferences } = require("../controllers/PreferenceController");

router.post("/save-preferences", savePreferences);

// Get preferences for a user
router.get("/:userId", getPreferences);

module.exports = router;
