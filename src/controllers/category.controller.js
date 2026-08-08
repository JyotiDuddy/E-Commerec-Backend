const mongoose = require("mongoose");
const Category = require("../models/category.model");
const ProductType = require("../models/productType.model")



const addCategory = async (req, res) => {
  try {
    const { name, typeId } = req.body;
    const productType = await ProductType.findById(typeId);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found"
      })
    }

    const productCategory = await Category.create({
      name,
      type: typeId
    });
    // Populate Product Type details
    await productCategory.populate("type");


    res.status(201).json({
      success: true,

      message: "Product category created successfully",
      productCategory
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }


}
const getAllCategories = async (req, res) => {
  try {
    const getCategories = await Category.find({
      isActive: true,
    }).populate("type");

    res.status(200).json(getCategories);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCategoriesByType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const productType = await ProductType.findById(typeId);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found",
      });
    }

    const getCategories = await Category.find({
      type: typeId,
      isActive: true,
    }).populate("type");

    res.status(200).json(getCategories);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const getCategories = await Category.find().populate("type");

    res.status(200).json(getCategories);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("type");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const updateCategory = async (req, res) => {
  try {
    const { name, typeId } = req.body;

    // Object that will contain fields to update
    const updateData = {};

    // Update name if provided
    if (name) {
      updateData.name = name;
    }

    // Update Product Type if provided
    if (typeId) {
      const productType = await ProductType.findById(typeId);

      if (!productType) {
        return res.status(404).json({
          success: false,
          message: "Product Type not found",
        });
      }

      updateData.type = typeId;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("type");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteCategory = async(req,res)=>{
  try{
  const category=await  Category.findByIdAndDelete(req.params.id);

  if(!category){
      return res.status(404).json({
      success:false,
      message:"category not found"
    })
  }
    res.status(200).json({
    success:true,
    message:"Category deleted successfully"
  })
  }catch(err){
res.status(500).json({
      success:false,
      message:err.message
    })
  }  


}


const toggleCategory=async (req,res)=>{
  try{
  const category=await Category.findById(req.params.id)
    if(!category){
        return res.status(404).json({
          success:false,
          message:"Category not found",

        })
      }
      category.isActive= !category.isActive

      await category.save();

      res.status(200).json({
          success:true,
        message:category.isActive?"Category Activated":"Category Deactivated",
        isActive:category.isActive
      })
  }catch(err){
        res.status(500).json({
  success:false,
    message:err.message
    })
  }

}

module.exports={
  getAllCategories,getCategoriesByType,addCategory,getAllCategoriesAdmin,getSingleCategory,updateCategory,deleteCategory,toggleCategory
}