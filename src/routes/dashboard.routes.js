const express = require("express");

const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboard.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

module.exports = router;