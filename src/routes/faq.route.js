const express = require("express");

const router = express.Router();

const {
  addFaq,
  adminGetAllFaq,
  getSingleFaq,
  updateFaq,
  toggleFaq,
  deleteFaq,
  getallFaqs,
} = require("../controllers/faq.controller");


// ======================
// Public Routes
// ======================

// Get all active FAQs
router.get("/all", getallFaqs);


// ======================
// Admin Routes
// ======================

// Get all FAQs (Admin)
router.get("/admin/all", adminGetAllFaq);

// Get single FAQ
router.get("/admin/:id", getSingleFaq);

// Add FAQ
router.post("/admin/add", addFaq);

// Update FAQ
router.put("/admin/update/:id", updateFaq);

// Toggle FAQ Status
router.patch("/admin/toggle/:id", toggleFaq);

// Delete FAQ
router.delete("/admin/delete/:id", deleteFaq);

module.exports = router;