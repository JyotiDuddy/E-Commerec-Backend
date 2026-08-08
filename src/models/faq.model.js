const mongoose = require("mongoose");


const faaqSchema= new  mongoose.Schema({
  question:{
    type:String,
    default:true,
    trim:true
  },
  answer:{
    type:String,
    default:true,
    trim:true
  },
    isActive:{
    type:Boolean,
    default:true,

  },

},{
  timestamps:true
})


const faqModel = mongoose.model("FAQ",faaqSchema);


module.exports = faqModel;