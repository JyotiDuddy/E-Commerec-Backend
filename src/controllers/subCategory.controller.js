const mongoose = require("mongoose");

const SubCategory = require("../models/subCategory.model");
const Category = require("../models/category.model");

// =========================
// Get All Active Sub Categories
// =========================
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      isActive: true,
    }).populate("category");

    res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Get Sub Categories By Category
// =========================
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subCategories = await SubCategory.find({
      category: categoryId,
      isActive: true,
    }).populate("category");

    res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Add Sub Category
// =========================
const addSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subCategory = await SubCategory.create({
      name,
      category: categoryId,
    });

    await subCategory.populate("category");

    res.status(201).json({
      success: true,
      message: "Sub Category created successfully",
      subCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Get All Sub Categories (Admin)
// =========================
const getAllSubCategoriesAdmin = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category");

    res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Get Single Sub Category
// =========================
const getSingleSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category"
    );

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    res.status(200).json({
      success: true,
      subCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Update Sub Category
// =========================
const updateSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      updateData.category = categoryId;
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category");

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sub Category updated successfully",
      subCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Delete Sub Category
// =========================
const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sub Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Toggle Sub Category Status
// =========================
const toggleSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    subCategory.isActive = !subCategory.isActive;

    await subCategory.save();

    res.status(200).json({
      success: true,
      message: subCategory.isActive
        ? "Sub Category Activated"
        : "Sub Category Deactivated",
      isActive: subCategory.isActive,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllSubCategories,
  getSubCategoriesByCategory,
  addSubCategory,
  getAllSubCategoriesAdmin,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
  toggleSubCategory,
};