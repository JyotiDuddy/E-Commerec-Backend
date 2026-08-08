const mongoose = require("mongoose");

const paymentSetupSchema = new mongoose.Schema(
  {
    isOnlineActive: {
      type: Boolean,
      default: true,
    },
    isCodActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentSetup = mongoose.model(
  "PaymentSetup",
  paymentSetupSchema
);

module.exports = PaymentSetup;