const mongoose = require("mongoose");


const notificationSchema= new mongoose.Schema({
  type:{
  type:String,
  required:true,
  trim:true,
enum: [
        "NEW_ORDER",
        "LOW_STOCK",
        "NEW_ENQUIRY"
    ]
  },
  message:{
      type:String,
  required:true,
  trim:true,
  },
  relatedId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  isRead:{
    type:Boolean,
    default:false
  }

},
{timestamps:true});


const NOTIFICATION = mongoose.model("NOTIFICATION",notificationSchema);

module.exports= NOTIFICATION