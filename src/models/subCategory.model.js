const mongoose = require("mongoose");
const Category = require("./category.model");

const SubCategoryModel= new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trime:true
  },
  category:{
   type:mongoose.Schema.ObjectId,
   ref:"Category",
   required:true
  },
  isActive:{
    required:true,
    type:Boolean,
    default:true
  }
},{
  timestamps:true
})


const SubCategory= mongoose.model("SubCategory", SubCategoryModel);

module.exports= SubCategory