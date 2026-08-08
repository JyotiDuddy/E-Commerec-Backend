const express = require("express");

const router = express.Router();

const {
  subscribe,
  unSubscribe,
  adminGetAllSubscribers,
  adminDeleteSubscriber,
} = require("../controllers/newsletter.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");

// User Routes
router.post("/subscribe", authMiddleware, subscribe);

router.put("/unsubscribe", authMiddleware, unSubscribe);

// Admin Routes
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  adminGetAllSubscribers
);

router.delete(
  "/admin/delete/:id",
  authMiddleware,
  adminMiddleware,
  adminDeleteSubscriber
);

module.exports = router;