const mongoose = require("mongoose");


const categorySchema= new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  type:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ProductType",
    required:true
  },
  isActive:{
  type:Boolean,
  default:true,

  }
},{
  timestamps:true
})

const Category= mongoose.model("Category",categorySchema)

module.exports= Category