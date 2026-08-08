const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


// =======================
// ADMIN REGISTER
// =======================

const AdminRegister = async (req, res) => {
  try {
    console.log("========== ADMIN REGISTER ==========");

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      key,
    } = req.body;

    console.log("Request Body:", req.body);

    // ==========================
    // Validate Fields
    // ==========================
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !key
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ==========================
    // Validate Admin Secret Key
    // ==========================
    console.log("Frontend Key :", key);
    console.log("ENV Key      :", process.env.ADMIN_SECRET_KEY);

    if (key.trim() !== process.env.ADMIN_SECRET_KEY.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin Code",
      });
    }

    console.log("✅ Admin Code Verified");

    // ==========================
    // Check Existing User
    // ==========================
    const existingUser = await User.findOne({ email });

    console.log("Existing User:", existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ==========================
    // Create Admin
    // ==========================
    const admin = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      isAdmin: true,
    });

    console.log("Admin Created Successfully");
    console.log(admin);

    // ==========================
    // Generate JWT
    // ==========================
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==========================
    // Set Cookie
    // ==========================
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ==========================
    // Success Response
    // ==========================
    return res.status(201).json({
      success: true,
      message: "Admin Registered Successfully",
      authToken: token,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isAdmin: admin.isAdmin,
      },
    });

  } catch (err) {
    console.error("Admin Register Error:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =======================
// ADMIN LOGIN
// =======================

const AdminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check admin role
    if (!admin.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      authToken: token,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isAdmin: admin.isAdmin,
      },
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// =======================
// ADMIN PROFILE
// =======================

const AdminProfile = async (req, res) => {
  try {
    // req.user comes from authMiddleware

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        isAdmin: req.user.isAdmin,
      },
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


// =======================
// ADMIN LOGOUT
// =======================

const AdminLogout = async (req, res) => {

  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};


const GetUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  AdminRegister,
  AdminLogin,AdminProfile,AdminLogout,GetUsers
};