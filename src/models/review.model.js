const mongoose = require("mongoose");
const Product = require("./product.model")

const reviewSchema= mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
  },
  rating:{
    type:Number,
  },
  comment:{
    type:String
  }
},
{
  timestamps:true
});

const Review= mongoose.model("Review",reviewSchema);

module.exports= Review