const mongoose = require("mongoose");


const AdvertisemntSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  advertiser: {
    type: String,
    required: true,
    trim: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
    trim: true
  },
  subText: {
    type: String,
    default: "",
    trim: true,
  },
  buttonText: {
    type: String,
    default: "Shop Now",
    trim: true,

  },
  redirectType: {
    type: String,
    enum: ["external", "internal"],
    default: "external"
  },
redirectUrl:{
  type:String,
  required:true,
  trim:true
},
showOnHome:{
  type:Boolean,
  default:false,
},
showOnList:{
  type:Boolean,
  default:false,
},
showOnView:{
  type:Boolean,
  default:false,
},
priority:{
  type:Number,
  default:1,
},
isActive:{
  type:Boolean,
  default:true,
},
startDate:{
  type:Date,
  default:null,
},
endDate:{
  type:Date,
  default:null,
},

},
{
  timestamps:true,
});

const Advertisement= mongoose.model("Advertisement",AdvertisemntSchema);


module.exports= Advertisement