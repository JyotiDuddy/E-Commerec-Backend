const express = require("express");

const router = express.Router();

const {
  addHomeSetting,
  getHomeSetting,
  updateHomeSetting,
  getPublicHomePage,
} = require("../controllers/home.controller");

// =======================
// Public Route
// =======================

// Get Home Page Data
router.get("/data", getPublicHomePage);

// =======================
// Admin Routes
// =======================

// Add New Home Settings
router.post("/admin/add", addHomeSetting);

// Get Active Home Settings
router.get("/admin/settings", getHomeSetting);

// Update Active Home Settings
router.put("/admin/settings", updateHomeSetting);

module.exports = router;