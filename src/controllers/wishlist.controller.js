const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");




// =========================
// Add to Wishlist
// =========================
const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product Id is required",
      });
    }

    // Check Product
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Already Exists
    const existingWishlist = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: userId,
      product: productId,
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Get Wishlist
// =========================
const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    const wishlist = await Wishlist.find({
      user: userId,
    }).populate(
  "product",
  "title price discount images quantity type category isActive"
);

    const validWishlists = wishlist.filter(
      (item) => item.product && item.product.isActive
    );

  res.status(200).json({
  success: true,
  wishlist: validWishlists.map(item => ({
    _id: item._id,
    product: {
      ...item.product.toObject(),
      image: item.product.images || [],
    },
  })),
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Remove Wishlist
// =========================
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    await Wishlist.deleteOne({
      user: userId,
      product: productId,
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Admin Get All Wishlists
// =========================
const adminGetAllWishlists = async (req, res) => {
  try {

    const wishlists = await Wishlist.find({})
      .populate(
        "user",
        "firstName lastName email phoneNumber"
      )
      .populate(
        "product",
        "title price discount image quantity isActive"
      )
      .sort({ createdAt: -1 });

    const allFlat = wishlists.map(item => ({
      _id: item._id,
      user: item.user,
      productId: item.product,
      date: item.createdAt,
    }));

    const groupedMap = {};

    wishlists.forEach(item => {

      if (!item.user) return;

      const userId = item.user._id.toString();

      if (!groupedMap[userId]) {
        groupedMap[userId] = {
          user: item.user,
          wishlistItems: [],
        };
      }

      groupedMap[userId].wishlistItems.push({
        _id: item._id,
        productId: item.product,
        date: item.createdAt,
      });

    });

    res.json({
      success: true,
      groupedByUsers: Object.values(groupedMap),
      allFlat,
      count: wishlists.length,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};



module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  adminGetAllWishlists,
};