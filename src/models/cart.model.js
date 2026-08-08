const mongoose = require("mongoose");
const Product = require("./product.model");
const User= require("../models/user.model")

const CartItemSchema= new mongoose.Schema({
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true,
  },
  quantity:{
    type:Number,
    required:true,
    min:1,
    default:1
  }
},{
  _id:false
})

const CartSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  items:[CartItemSchema],

},
{timestamps:true})

const CartModel= mongoose.model("Cart",CartSchema);

module.exports = CartModel