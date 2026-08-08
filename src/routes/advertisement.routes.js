const express = require("express");

const router = express.Router();

const {
  addAdvertisement,
  adminGetAllAdvertisements,
  getSingleAdvertisement,
  updateAdvertisement,
  toggleAdvertisement,
  deleteAdvertisement,
  getAllAdvertisement,
  getHomeAdvertisements,
  getListAdvertisement,
  getViewAdvertisement,
} = require("../controllers/advertisement.controller");


// ================= PUBLIC ROUTES =================

// Get all active advertisements
router.get("/all", getAllAdvertisement);

// Home page advertisements
router.get("/home", getHomeAdvertisements);

// Product list page advertisements
router.get("/list", getListAdvertisement);

// Product detail page advertisements
router.get("/view", getViewAdvertisement);


// ================= ADMIN ROUTES =================

// Get all advertisements
router.get("/admin/all", adminGetAllAdvertisements);

// Get single advertisement
router.get("/admin/:id", getSingleAdvertisement);

// Add advertisement
router.post("/admin/add", addAdvertisement);

// Update advertisement
router.put("/admin/update/:id", updateAdvertisement);

// Toggle advertisement status
router.patch("/admin/toggle/:id", toggleAdvertisement);

// Delete advertisement
router.delete("/admin/delete/:id", deleteAdvertisement);

module.exports = router;