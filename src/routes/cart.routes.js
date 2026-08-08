const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  adminGetAllCarts,clearCart
} = require("../controllers/cart.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

// Customer Routes
router.post("/add", authMiddleware, addToCart);

router.get("/get", authMiddleware, getCart);

router.put("/update", authMiddleware, updateCart);

router.delete("/remove", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);

// Admin Route
router.get("/admin/all", authMiddleware, adminGetAllCarts);

module.exports = router;