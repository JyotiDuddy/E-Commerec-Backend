const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Enquiry = require("../models/enquiry.model");

const getDashboardStats = async (req, res) => {
  try {

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    );

    // ==========================
    // SUMMARY
    // ==========================

    const totalUsers = await User.countDocuments();

    const newUsersMonth = await User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    });

    const totalOrders = await Order.countDocuments();

    const ordersMonth = await Order.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    });

    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueResult.length > 0
        ? totalRevenueResult[0].totalRevenue
        : 0;

    const revenueMonthResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          createdAt: {
            $gte: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const revenueThisMonth =
      revenueMonthResult.length > 0
        ? revenueMonthResult[0].revenue
        : 0;

    // ==========================
    // REVENUE TIMELINE
    // ==========================

    const revenueTimelineRaw = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          createdAt: {
            $gte: sixMonthsAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalAmount",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const revenueTimeline = revenueTimelineRaw.map((item) => ({
      name: `${months[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      orders: item.orders,
    }));

    // Remaining dashboard sections

        // ==========================
    // ORDER STATUS CHART
    // ==========================

    const orderStatusRaw = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          value: {
            $sum: 1,
          },
        },
      },
    ]);

    const orderStatus = orderStatusRaw.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    // ==========================
    // TOP SELLING PRODUCTS
    // ==========================

    const topSellers = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          soldCount: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          soldCount: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: "$product._id",
          title: "$product.title",
          price: "$product.price",
          quantity: "$product.quantity",
          image: "$product.images",
          soldCount: 1,
        },
      },
    ]);

    // ==========================
    // LOW STOCK PRODUCTS
    // ==========================

    const lowStock = await Product.find({
      quantity: {
        $lte: 5,
      },
    })
      .select("title quantity")
      .sort({
        quantity: 1,
      })
      .limit(5);

    // ==========================
    // RECENT ORDERS
    // ==========================

    const recentOrders = await Order.find()
      .populate("user", "firstName lastName email")
      .select(
        "totalAmount paymentStatus orderStatus createdAt user"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // ==========================
    // RECENT ENQUIRIES
    // ==========================

    const recentEnquiries = await Enquiry.find()
      .select("name subject status createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(5);
          // ==========================
    // FINAL RESPONSE
    // ==========================

    return res.status(200).json({
      success: true,

      summary: {
        totalRevenue,
        revenueThisMonth,
        totalOrders,
        ordersMonth,
        totalUsers,
        newUsersMonth,
      },

      charts: {
        revenueTimeline,
        orderStatus,
      },

      products: {
        topSellers,
        lowStock,
      },

      activity: {
        recentOrders,
        recentEnquiries,
      },
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  getDashboardStats,
};