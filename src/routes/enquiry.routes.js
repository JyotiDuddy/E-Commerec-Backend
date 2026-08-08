const express = require("express");

const router = express.Router();

const {
  addEnquiry,
  adminGetAllEnquiry,
  getSingleEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiry.controller");


// ======================
// Public Routes
// ======================

// Submit Enquiry
router.post("/add", addEnquiry)


// ======================
// Admin Routes
// ======================

// Get All Enquiries
router.get("/admin/all", adminGetAllEnquiry);

// Get Single Enquiry
router.get("/admin/:id", getSingleEnquiry);

// Update Enquiry Status
router.put("/admin/update-status/:id", updateEnquiryStatus);

// Delete Enquiry
router.delete("/admin/delete/:id", deleteEnquiry);


module.exports = router;