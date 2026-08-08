
const express = require("express");

const router = express.Router();

const {
  addProduct,
  getSingleProduct,
  getAllProductAdmin,
  updateProdut,
  deleteProduct,
  toggleProduct,
  getAllProducts,
  getFeaturedProducts,
  getSponsoredProducts,
  addReview,
  deleteReview,
} = require("../controllers/product.Controller")


router.get("/", getAllProducts);

router.get("/featured", getFeaturedProducts);

router.get("/sponsored", getSponsoredProducts);

// ✅ Admin routes first
router.get("/admin/all", getAllProductAdmin);
router.post("/admin/add", addProduct);
router.put("/admin/update/:id", updateProdut);
router.delete("/admin/delete/:id", deleteProduct);
router.patch("/admin/toggle/:id", toggleProduct);

// Public routes with :id last
router.get("/:id", getSingleProduct);
router.post("/:id/review", addReview);
router.delete("/:productId/review/:reviewId", deleteReview);

module.exports = router;