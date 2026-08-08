const mongoose = require("mongoose");


const DeliveryDetailModel= new mongoose.Schema({
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

const DeliveryDetail= mongoose.model("DeliveryDetail",DeliveryDetailModel);
module.exports = DeliveryDetail