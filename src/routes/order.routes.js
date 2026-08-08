const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");



const {
  createOrder,
  verifyPayment,
  myOrder,
  getSingleOrder,
  cancelOrder,
  adminGetAllOrders,
  adminGetSingleOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

// Customer
router.post("/checkout", authMiddleware, createOrder);

router.post("/verify-payment",authMiddleware,verifyPayment)

router.get("/my-orders", authMiddleware, myOrder);

router.get("/:orderId", authMiddleware, getSingleOrder);

router.put("/cancel/:orderId", authMiddleware, cancelOrder);

// Admin
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  adminGetAllOrders
);

router.get(
  "/admin/:orderId",
  authMiddleware,
  adminMiddleware,
  adminGetSingleOrder
);

router.put(
  "/admin/status/:orderId",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;