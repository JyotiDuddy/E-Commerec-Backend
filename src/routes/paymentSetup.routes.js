const express = require("express");

const router = express.Router();

const {
  getPaymentSettings,
  updatePaymentSettings,
  getActivePaymentModes,
} = require("../controllers/paymentSetup.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");

// Public
router.get("/active", getActivePaymentModes);

// Admin
router.get(
  "/admin/settings",
  authMiddleware,
  adminMiddleware,
  getPaymentSettings
);

router.put(
  "/admin/settings",
  authMiddleware,
  adminMiddleware,
  updatePaymentSettings
);

module.exports = router;