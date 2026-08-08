const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,

  },
  subject: {
    type: String,
    required: true,

  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["new", "in-progress", "fulfilled", "rejected"],
    default: "new"

  },

  remark: {
    type: String,
    required: false,
    default:"",

  },


});

const enquiryModel = new mongoose.model("Enquiry",enquirySchema);

module.exports = enquiryModel

