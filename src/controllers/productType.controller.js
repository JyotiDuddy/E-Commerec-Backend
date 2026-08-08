const mongoose = require("mongoose");

const ProductType= require("../models/productType.model");
const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");


const getCategoryMenu = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ isActive: true });

    const data = await Promise.all(
      productTypes.map(async (type) => {
        const categories = await Category.find({
          type: type._id,
          isActive: true,
        });

        const categoryData = await Promise.all(
          categories.map(async (category) => {
            const subCategories = await SubCategory.find({
              category: category._id,
              isActive: true,
            });

            return {
              ...category.toObject(),
              subCategories,
            };
          })
        );

        return {
          ...type.toObject(),
          categories: categoryData,
        };
      })
    );

    res.json({
      success: true,
      menu: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const addProductType = async (req, res) => {
  try {
    const { name, image } = req.body;

    const existing = await ProductType.findOne({
      name: name.trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product type already exists",
      });
    }

    const type = await ProductType.create({
      name: name.trim(),
      image,
    });

    res.status(201).json({
      success: true,
      type,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// {
//    "name":"Clothing",
//    "image":"https://abc.com/image.jpg"
// }
// {
//    "success":true,
//    "msg":"Product type added successfully",
//    "productType":{...}
// }

const getAllTypes= async(req,res)=>{
  try{
    const types= await ProductType.find({
      isActive:true
    })
    res.status(200).json(types)

  }catch(err){
 res.status(500).json({
  success:false,
  message:err.message
 })
  }
}


const getAllTypesAdmin= async(req,res)=>{
  try{
    const types= await ProductType.find()

    res.status(200).json({
      success:true,
      types
    })
  }
  catch(err){
   res.status(500).json({
    success:false,
    message:err.message
   })
  }
}

const getSingleType= async(req,res)=>{

  try{
    const productType= await ProductType.findById(req.params.id);

    if(!productType){
      return res.status(404).json({
        success:false,
        message:"Product type not found"
      })
    }

    res.status(200).json({
      success:true,
      productType
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })

  }
}
const updateProductType= async(req,res)=>{
  try{
    const productType = await ProductType.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    })

    if(!productType){
      return res.status(404).json({
        success:false,
        message:"Product type not found"
      })
    }
    res.status(200).json({
      success:true,
      message:"Product type update successfully",
      productType
    })

  }catch(err){
    res.status(500).json({
  success:false,
    message:err.message
    })
  
  }
}

const deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findByIdAndDelete(req.params.id);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product type deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const toggleProductType= async(req,res)=>{
  try{
    const productType=await ProductType.findById(req.params.id);

      if(!productType){
        return res.status(404).json({
          success:false,
          message:"Product type not found",

        })
      }
      productType.isActive  = !productType.isActive;

      await productType.save()
    

      res.status(200).json({
        success:true,
        message:productType.isActive?"Product Type Activated":"Product Type Deactivated",
        isActive:productType.isActive

      })


  }catch(err){
      res.status(500).json({
  success:false,
    message:err.message
    })
  }
}


module.exports= {
  addProductType,getAllTypes, getAllTypesAdmin, getSingleType,updateProductType,deleteProductType, 
  toggleProductType ,getCategoryMenu
}