const express = require("express");

const router = express.Router()


const {
  getAllSubCategories,
  getSubCategoriesByCategory,
  addSubCategory,
  getAllSubCategoriesAdmin,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
  toggleSubCategory,
}= require("../controllers/subCategory.controller");

router.get("/all", getAllSubCategories);

router.get("/by-category/:categoryId", getSubCategoriesByCategory);

router.post("/admin/add", addSubCategory);

router.get("/admin/all", getAllSubCategoriesAdmin);

router.get("/admin/:id", getSingleSubCategory);

router.put("/admin/update/:id", updateSubCategory);

router.delete("/admin/delete/:id", deleteSubCategory);

router.patch("/admin/toggle/:id", toggleSubCategory);


module.exports= router