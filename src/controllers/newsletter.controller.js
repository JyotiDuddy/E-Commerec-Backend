const Newsletter = require('../models/newsletter.model');
const User = require("../models/user.model");


const subscribe = async (req, res) => {
  try {
    const userId = req.userId;

    const { email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found "
      })
    }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    message: "Invalid email address",
  });
}
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found "
      })
    }

    const emailSubsrcibed = await Newsletter.findOne({
      email: email,

    });

    if (emailSubsrcibed && emailSubsrcibed.isSubscribed) {
      return res.status(400).json({

        "success": false,
        "message": "Already subscribed"

      })
    }

    if (emailSubsrcibed) {
      emailSubsrcibed.isSubscribed = true;
      await emailSubsrcibed.save();

      return res.status(200).json({
        success: true,
        message: "Subscribed successfully",
        newsletter:emailSubsrcibed,
      });
    }

    const newSubscriber = await Newsletter.create({
      email,
      isSubscribed: true,
    })
    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      newsletter: newSubscriber,
    });


  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const unSubscribe = async (req, res) => {
  try {

    const userId = req.userId;
    const { email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const newsletter = await Newsletter.findOne({
      email,
    });

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Email is not subscribed",
      });
    }

    if (!newsletter.isSubscribed) {
      return res.status(400).json({
        success: false,
        message: "Already unsubscribed",
      });
    }

    newsletter.isSubscribed = false;

    await newsletter.save();

    return res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
      newsletter,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
const adminGetAllSubscribers = async (req, res) => {
  try {

  const {
    page = 1,
    limit = 10,
    isSubscribed,
    search = "",
} = req.query;

    const filter = {};

    if (search) {
    filter.email = {
        $regex: search,
        $options: "i",
    };
}

    if (isSubscribed === "true") {
      filter.isSubscribed = true
    }
    if (isSubscribed === "false") {
      filter.isSubscribed = false
    }
    const currentpage = Number(page);

    const perPage = Number(limit);

    const skip = (currentpage - 1) * perPage;

    const newsletter = await Newsletter.find(filter).sort({
      createdAt: -1
    }).skip(skip).limit(perPage);

    const totalDocs = await Newsletter.countDocuments(filter);

    const totalPages = Math.ceil(totalDocs / perPage);

    res.status(200).json({
      success: true,
      subscribers: newsletter,
      count: newsletter.length,
      totalDocs,
      totalPages,
      page: currentpage,
      hasNextPage: currentpage < totalPages,
      limit: perPage,
      hasPrevPage: currentpage > 1,
    })




  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const adminDeleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscribe = await Newsletter.findByIdAndDelete(id);

    if (!subscribe) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      })
    }

  

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}
module.exports = { subscribe, unSubscribe, adminGetAllSubscribers, adminDeleteSubscriber }