const mongoose = require("mongoose");


const BankOfferModel= new mongoose.Schema({
  detail:{
    required:true,
    type:String
  },
  isActive:{
  required:true,
  type:Boolean,
  default:true
  }

},{
  timestamps:true
});

const BankOffer= mongoose.model("BankOffer",BankOfferModel);
module.exports = BankOffer