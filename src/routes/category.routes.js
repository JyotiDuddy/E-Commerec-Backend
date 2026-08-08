const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  getCategoriesByType,
  getAllCategoriesAdmin,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  toggleCategory,
} = require("../controllers/category.controller");

router.get("/all", getAllCategories);

router.get("/by-type/:typeId", getCategoriesByType);

router.post("/admin/add", addCategory);

router.get("/admin/all", getAllCategoriesAdmin);

router.get("/admin/:id", getSingleCategory);

router.put("/admin/update/:id", updateCategory);

router.delete("/admin/delete/:id", deleteCategory);

router.patch("/admin/toggle/:id", toggleCategory);

module.exports = router;
