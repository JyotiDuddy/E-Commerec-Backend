const mongoose = require("mongoose");


const legalSchema= new mongoose.Schema({
  type:{
    type:String,
    required:true,
    trim:true,
    enum:["terms","privacy_policy","delivery_policy","return_policy","about","career"]
  },
  title:{
      type:String,
    required:true,
    trim:true,
  },
  shortDescription:{
      type:String,
    required:true,
    trim:true,
  },
  fullContent:{
    type:String,
    required:true,
    trim:true
  },
  isActive:{
    type:Boolean,
    default:true
  }
},
{
  timestamps:true
});

const LegalModel= mongoose.model("LegalModel",legalSchema);

module.exports = LegalModel