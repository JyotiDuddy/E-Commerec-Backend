const express = require("express");
const router = express.Router();

const {
  addBankOffer,
  getAllBankOffer,
  getAllBankOfferAdmin,
  getSingleBankOffer,
  updateBankOffer,
  deleteBankOffer,
  toggleBankOffer,
} = require("../controllers/bankOffer.controller");

// Public Routes
router.get("/all", getAllBankOffer);

// Admin Routes
router.post("/admin/add", addBankOffer);

router.get("/admin/all", getAllBankOfferAdmin);

router.get("/admin/:id", getSingleBankOffer);

router.put("/admin/update/:id", updateBankOffer);

router.delete("/admin/delete/:id", deleteBankOffer);

router.patch("/admin/toggle/:id", toggleBankOffer);

module.exports = router;