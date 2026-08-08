const express = require("express");
const router = express.Router();

const{
  addProductType,getAllTypes, getAllTypesAdmin, getSingleType,updateProductType,deleteProductType, 
  toggleProductType, getCategoryMenu
} = require("../controllers/productType.controller");

// Public Routes
router.get("/all", getAllTypes);
router.get("/menu", getCategoryMenu);
// Admin Routes
router.post("/admin/add", addProductType);

router.get("/admin/all", getAllTypesAdmin);

router.get("/admin/:id", getSingleType);

router.put("/admin/update/:id", updateProductType);

router.delete("/admin/delete/:id", deleteProductType);

router.patch("/admin/toggle/:id", toggleProductType);

module.exports = router;