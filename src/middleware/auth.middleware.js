const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  console.log("========== AUTH MIDDLEWARE ==========");

  console.log("Cookies:", req.cookies);

  const { token } = req.cookies;

  if (!token) {
    console.log("❌ NO TOKEN");

    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    const user = await User.findById(decoded.id);

    console.log("User from database:", user);
    console.log("User isAdmin:", user?.isAdmin);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    req.userId = user._id;

    next();

  } catch (err) {
    console.log("AUTH ERROR:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authMiddleware };