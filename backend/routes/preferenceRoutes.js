const express = require("express");
const router = express.Router();

const { savePreferences } = require("../controllers/PreferenceController");

router.post("/save-preferences", savePreferences);

module.exports = router;