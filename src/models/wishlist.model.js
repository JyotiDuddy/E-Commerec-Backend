const mongoose = require("mongoose");
const Product = require("./product.model");
const User= require("../models/user.model")

const wishlistSchema= new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User,"
  },
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"
  },
  
},
{
  timestamps:true,
});

wishlistSchema.index({
  user:1,
  product:1
},{unique:true});


const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;