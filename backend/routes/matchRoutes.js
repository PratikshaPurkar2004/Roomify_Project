const express = require("express");
const router = express.Router();
const matchController = require("../controllers/MatchController");

router.get("/optimal/:userId", matchController.findOptimalMatch);

module.exports = router;
