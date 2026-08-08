const mongoose = require("mongoose");
const ProductType= require("./productType.model");
const Category = require("./category.model");
const SubCategory= require("./subCategory.model");
const BankOffer= require("./bankOffer.model");
const DeliveryDetail= require("./deliveryDetail.model")

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim:true,
  },
  type: {
    type: mongoose.Schema.ObjectId,
    ref: "ProductType",
    required: true
  },
  category: {
  type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  },
  brand: {
    required: true,
    type: String,
      trim:true,
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default:0,
  },
  images: [
    {
      type: String,
    },
  ],
  rating: {
  type: Number,
  default: 0,
},
  quantity: {
    type:Number,
    default:0
  },
  descriptions: [
    {
      type: String,
      required: true
    },

  ],
  bankOffers:[{
      type: mongoose.Schema.Types.ObjectId,
    ref: "BankOffer",
  
  }],
  deliveryDetails:[{
      type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryDetail",
    
  }],
  reviews:[reviewSchema],
  isFeatured:{
    type:Boolean,
      default:false
  },
  isSponsored:{
      type:Boolean,
      default:false
  },
  isActive:{
      type:Boolean,
      default:true,
  },


},{
  timestamps:true
}
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel