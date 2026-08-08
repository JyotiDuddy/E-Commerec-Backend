const Order = require("../models/order.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const razorpay = require("../config/razorpay");
const Product = require("../models/product.model");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");;
const PaymentSetup= require("../models/paymentSetup.model")

const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId, paymentMode } = req.body;

    // Validate payment mode
    if (!["COD", "ONLINE"].includes(paymentMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment mode",
      });
    }
  

// Check payment settings
let settings = await PaymentSetup.findOne();

if (!settings) {
  settings = await PaymentSetup.create({
    isOnlineActive: true,
    isCodActive: true,
  });
}

if (paymentMode === "ONLINE" && !settings.isOnlineActive) {
  return res.status(400).json({
    success: false,
    message: "Online payment is currently unavailable",
  });
}

if (paymentMode === "COD" && !settings.isCodActive) {
  return res.status(400).json({
    success: false,
    message: "Cash on Delivery is currently unavailable",
  });
}


    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find selected address
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Prepare order items
    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${product?.title || "Product"} is unavailable`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} is out of stock`,
        });
      }

      const priceToUse =
        product.discount > 0
          ? product.price - product.price * (product.discount / 100)
          : product.price;

      totalAmount += priceToUse * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: priceToUse,
        quantity: item.quantity,
        image: product.images[0] || "",
      });
    }

    // Create shipping address snapshot
    const shippingAddress = {
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    };

    // Create Order
    const order = await Order.create({
      user: userId,
      shippingAddress,
      items: orderItems,
      totalAmount,
      paymentMode,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // COD Flow
    if (paymentMode === "COD") {
      // Reduce stock
      for (const item of cart.items) {
        item.product.quantity -= item.quantity;
        await item.product.save();
      }

      // Empty cart
      cart.items = [];
      await cart.save();

      return res.status(201).json({
        success: true,
        message: "COD Order Placed Successfully",
        order,
      });
    }

    if(paymentMode ==="ONLINE"){
    const options={
      amount:totalAmount*100,
      currency:"INR",
      receipt:`receipt_${Date.now()}`
    }
const razorpayOrder = await razorpay.orders.create(options);

order.razorpayOrderID = razorpayOrder.id;

await order.save();

    return res.status(201).json({
    success: true,
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    key: process.env.RAZORPAY_API_KEY,
});
    }
  
  

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const verifyPayment = async (req, res) => {
  try {

    const { paymentId, orderId, signature } = req.body;


    const isValid = validatePaymentVerification(
      {
        order_id: orderId,
        payment_id: paymentId,
      },
      signature,
      process.env.RAZORPAY_SECRET_KEY
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    const order = await Order.findOne({
      razorpayOrderID: orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
        if (order.paymentStatus === "Paid") {
    return res.status(400).json({
        success:false,
        message:"Payment already verified"
    });
}

order.paymentStatus = "Paid";
order.orderStatus = "Processed";
    order.razorpayPaymentId = paymentId;
    order.razorpaySignature = signature;

    for (const item of order.items) {
  const product = await Product.findById(item.product);

if(!product){
    continue;
}

product.quantity -= item.quantity;

await product.save();
    }

    await Cart.findOneAndUpdate(
      { user: order.user },
      { items: [] }
    );

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      order,
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

const myOrder= async(req,res)=>{
  try{
  const userId= req.userId;
  


  const orders = await Order.find({
    user:userId
  }).sort({
    createdAt:-1
  }).populate("items.product");


  res.status(200).json({
  success: true,
  orders,
});
  }catch(err){
      console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}
const getSingleOrder= async(req,res)=>{
  try{

    const userId = req.userId;
  const {orderId}= req.params;



  const order= await Order.findById(orderId).populate("items.product")



if(!order){
  return res.status(404).json({
    success:false,
    message:"No order by this OrderId"
  })
}

if(order.user.toString() !== userId){
     return res.status(403).json({
        success: false,
        message: "Unauthorized"
    });
}

res.status(200).json({
  success:true,
  order
})
  }catch(err){
        console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.orderStatus = "Cancelled";

    for (const item of order.items) {
      item.product.quantity += item.quantity;
      await item.product.save();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const adminGetAllOrders=async(req,res)=>{
  try{
  const{page=1, limit=10, paymentStatus,orderStatus,paymentMode}= req.query

  const filter={};

  if(orderStatus){
    filter.orderStatus= orderStatus
  }

  if(paymentStatus){
    filter.paymentStatus = paymentStatus
  }

  if(paymentMode){
    filter.paymentMode= paymentMode
  }

  const currentPage = Number(page);
  const perPage= Number(limit);

  const skip = (currentPage-1)*perPage;

  const orders= await Order.find(filter).populate("user","firstName lastName email phoneNumber" ).sort({
    createdAt:-1
  }).skip(skip).limit(perPage)

const totalOrders = await Order.countDocuments(filter);

res.status(200).json({
    success:true,
    page:currentPage,
    totalOrders,
    totalPages:Math.ceil(totalOrders/perPage),
    orders
})
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}


const adminGetSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "firstName lastName email phoneNumber")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const validStatus = [
      "Pending",
      "Processed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!validStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order Status",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  createOrder,verifyPayment,myOrder,getSingleOrder,cancelOrder,
adminGetAllOrders,updateOrderStatus,  adminGetSingleOrder,
};

