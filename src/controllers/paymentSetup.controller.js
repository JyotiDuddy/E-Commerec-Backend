const PaymentSetup = require("../models/paymentSetup.model");

// ==========================================
// GET ADMIN PAYMENT SETTINGS
// GET /api/payment-setup/admin/settings
// ==========================================
const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSetup.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await PaymentSetup.create({
        isOnlineActive: true,
        isCodActive: true,
      });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// UPDATE PAYMENT SETTINGS
// PUT /api/payment-setup/admin/settings
// ==========================================
const updatePaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSetup.findOne();

    if (!settings) {
      settings = await PaymentSetup.create({
        isOnlineActive: true,
        isCodActive: true,
      });
    }

    const { isOnlineActive, isCodActive } = req.body;

    if (typeof isOnlineActive === "boolean") {
      settings.isOnlineActive = isOnlineActive;
    }

    if (typeof isCodActive === "boolean") {
      settings.isCodActive = isCodActive;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      settings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// GET ACTIVE PAYMENT METHODS
// GET /api/payment-setup/active
// ==========================================
const getActivePaymentModes = async (req, res) => {
  try {
    let settings = await PaymentSetup.findOne();

    if (!settings) {
      settings = await PaymentSetup.create({
        isOnlineActive: true,
        isCodActive: true,
      });
    }

    return res.status(200).json({
      success: true,
      isOnlineActive: settings.isOnlineActive,
      isCodActive: settings.isCodActive,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getPaymentSettings,
  updatePaymentSettings,
  getActivePaymentModes,
};