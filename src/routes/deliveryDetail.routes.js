const express = require("express");
const router = express.Router();

const {
  addDeliveryDetail,
  getAllDeliveryDetail,
  getAlldeliveryDetailAdmin,
  getSingleDeliveryDetail,
  updateDeliveryDetail,
  deleteDeliveryDetail,
  toggleDeliveryDetail,
} = require("../controllers/deliveryDetail.controller");

// Public Routes
router.get("/all", getAllDeliveryDetail);

// Admin Routes
router.post("/admin/add", addDeliveryDetail);

router.get("/admin/all", getAlldeliveryDetailAdmin);

router.get("/admin/:id", getSingleDeliveryDetail);

router.put("/admin/update/:id", updateDeliveryDetail);

router.delete("/admin/delete/:id", deleteDeliveryDetail);

router.patch("/admin/toggle/:id", toggleDeliveryDetail);

module.exports = router;