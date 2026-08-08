const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
{
    email:{
        type:String,
    required:[true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true
    },

    isSubscribed:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});

newsletterSchema.index({ email:1 }, { unique:true });

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;