const express= require("express");

const router = express.Router();

const {Register,Login,ForgotPassword,ResetPassword,Logout,Profile,UpdateProfile,AddAddress,GetAddresses,DeleteAddress}= require("../controllers/auth.controller");

const {authMiddleware} = require("../middleware/auth.middleware")

router.post("/register",Register)
router.post("/login",Login)
router.post("/forgot-password",ForgotPassword);
router.post("/reset-password/:token",ResetPassword)
router.post("/logout",Logout)
router.get("/profile",authMiddleware,Profile);
router.put("/updateuser", authMiddleware, UpdateProfile);
router.post("/address", authMiddleware, AddAddress);
router.get("/address", authMiddleware, GetAddresses);
router.delete("/address/:id", authMiddleware, DeleteAddress);


module.exports = router;