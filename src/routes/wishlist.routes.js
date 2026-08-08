const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  adminGetAllWishlists,
} = require("../controllers/wishlist.controller");

const { authMiddleware}  = require("../middleware/auth.middleware");
const  { adminMiddleware}  = require("../middleware/admin.middleware");

// Customer
router.post("/add", authMiddleware, addToWishlist);

router.get("/", authMiddleware, getWishlist);

router.delete(
  "/:productId",
  authMiddleware,
  removeFromWishlist
);

// Admin
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  adminGetAllWishlists
);

module.exports = router;