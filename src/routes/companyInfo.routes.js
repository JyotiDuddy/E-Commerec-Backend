const express = require("express");

const router = express.Router();

const {
  addCompanyInfo,
  adminGetAllcompanyInfo,
  updateCompanyInfo,
  getActiveCompanyInfo,getCompanyInfoById,deleteCompanyInfo,toggleCompanyInfo
} = require("../controllers/companyInfo.controller");

// ================= Public Route =================

// Get Active Company Info
router.get("/active", getActiveCompanyInfo);

// ================= Admin Routes =================

// Add Company Info
router.post("/admin/add", addCompanyInfo);

// Get All Company Info
router.get("/admin/all", adminGetAllcompanyInfo);

// Update Company Info
router.put("/admin/update/:id", updateCompanyInfo);

router.get("/admin/:id", getCompanyInfoById);

router.delete("/admin/delete/:id", deleteCompanyInfo);

router.patch("/admin/toggle/:id", toggleCompanyInfo);

module.exports = router;