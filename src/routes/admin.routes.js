const express = require("express");
const router = express.Router();

const {
  AdminRegister,
  AdminLogin,
  AdminProfile,AdminLogout,GetUsers
} = require("../controllers/admin.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { adminMiddleware } = require("../middleware/admin.middleware");

console.log("authMiddleware:", authMiddleware);
console.log("adminMiddleware:", adminMiddleware);
console.log("AdminProfile:", AdminProfile);

router.post("/register", AdminRegister);
router.post("/login", AdminLogin);

router.get(
  "/getusers",
  authMiddleware,
  adminMiddleware,
  GetUsers
);

// Protected
router.get(
  "/profile",
  authMiddleware,
  adminMiddleware,
  AdminProfile
);

router.post(
  "/logout",
  authMiddleware,
  AdminLogout
);


module.exports = router;