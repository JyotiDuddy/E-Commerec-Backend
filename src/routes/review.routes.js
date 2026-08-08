
const express = require("express");
const router = express.Router();

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  adminGetAllReviews,
} = require("../controllers/review.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");


// Customer Routes
router.post("/create",authMiddleware, createReview);

router.get("/product/:productId", getProductReviews);

router.put("/update/:reviewId", authMiddleware, updateReview);

router.delete("/delete/:reviewId",authMiddleware, deleteReview);

// Admin Route
router.get("/admin/all", authMiddleware, adminMiddleware, adminGetAllReviews);

module.exports = router;