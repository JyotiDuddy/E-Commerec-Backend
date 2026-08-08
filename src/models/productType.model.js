
const mongoose = require("mongoose");

const productTypeSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  image:{
    type:String,
    required:true,
  },
  isActive:{
    type:Boolean,
    default:true,
  }
},
{
  timestamps:true
});

const ProductType= mongoose.model("ProductType",productTypeSchema);

module.exports= ProductType