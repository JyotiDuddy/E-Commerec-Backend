const express = require("express");

const router = express.Router();

const {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

// Add Address
router.post("/add", authMiddleware, addAddress);

// Get All Addresses
router.get("/get", authMiddleware, getAddress);

// Update Address
router.put("/update/:addressId", authMiddleware, updateAddress);

// Delete Address
router.delete("/delete/:addressId", authMiddleware, deleteAddress);

module.exports = router;