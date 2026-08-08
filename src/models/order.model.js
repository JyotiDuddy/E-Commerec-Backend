const mongoose = require("mongoose");
const Product = require("./product.model");

const orderItemSchema= new mongoose.Schema({
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true,
  },

  title:{
    type:String,
    required:true,
  },
  price:{
    type:Number,
    required:true,
  },
  quantity:{
    type:Number,
    required:true
  },
  image:{
    type:String
  }

},
{_id:false});

const orderSchema= new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  shippingAddress:{
    fullName:String,
    phoneNumber:String,
    street:String,
    city:String,
    state:String,
    zipCode:String,
    country:String,
  },
  items:[orderItemSchema],

  totalAmount:{
    type:Number,
    required:true,

  },
  paymentMode:{
    type:String,
    enum:["COD","ONLINE"],
    required:true,
  },
  paymentStatus:{
    type:String,
    enum:["Pending","Paid","Failed"],
    default:"Pending"
  },
  orderStatus:{
    type:String,
    enum:[
      "Pending",
      "Processed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Returned"
    ],
    default:"Pending"
  },
  razorpayOrderID:{
  type:String,
  default:null,
  },
  razorpayPaymentId:{
    type:String,
    default:null
  },
  razorpaySignature:{
    type:String,
    default:null
  },
  transactionDetails:{
    type:Object,
    default:{},
  }

  
},
{
  timestamps:true
});

const Order= mongoose.model("Order",orderSchema);

module.exports = Order