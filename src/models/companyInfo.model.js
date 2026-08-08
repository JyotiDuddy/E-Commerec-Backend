const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      required: true,
      trim: true,
    },

    themeColor: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    companyAddress: {
      type: String,
      required: true,
    },

    companyMail: {
      type: String,
      required: true,
    },

    companyNumber: {
      type: String,
      required: true,
    },

    supportMail: {
      type: String,
      required: true,
    },

    customerSupport: {
      type: String,
      required: true,
    },

    socialLinks: [
      {
        name: String,
        link: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CompanyInfo", companySchema);