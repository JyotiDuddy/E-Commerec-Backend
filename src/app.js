const express = require("express");

const cookieParser= require("cookie-parser");

const cors= require("cors");

const adminRoutes = require("./routes/admin.routes");

const authRoute= require("./routes/auth.routes.js");
const productRoute = require("./routes/product.routes.js");
const productTypeRoute = require("./routes/productType.routes.js");
const categoryRoute = require("./routes/category.routes.js");
const subCategoryRoute = require("./routes/subCategory.routes.js")
const bankOfferRoute= require("./routes/bankOffer.routes.js");
const deliveryDetailRoute = require("./routes/deliveryDetail.routes");
const advertisementRoutes = require("./routes/advertisement.routes");
const faqRoutes = require("./routes/faq.route");
const enquiryRoutes = require("./routes/enquiry.routes");
const legalRoutes= require("./routes/legal.routes.js");
const notificationRoutes= require("./routes/notification.routes.js");
const homeRoutes = require("./routes/home.routes");
const cartRoute= require("./routes/cart.routes.js")
const addressRoute = require("./routes/address.routes.js");
const orderRoute= require("./routes/order.routes.js");
const wishlistRoute = require("./routes/wishlist.routes.js");
const review= require("./routes/review.routes.js");
const newsletterRoutes = require("./routes/newsletter.routes.js");
const dashboardRoutes = require("./routes/dashboard.routes.js");
const paymentSetupRoutes = require("./routes/paymentSetup.routes");
const companyInfo = require("./routes/companyInfo.routes.js")


const app= express();
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL_1,
      process.env.FRONTEND_URL_2,
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/product",productRoute);
app.use("/api/product-type",productTypeRoute);
app.use("/api/category",categoryRoute);
app.use("/api/sub-category",subCategoryRoute );
app.use("/api/bank-offer",bankOfferRoute);
app.use("/api/delivery-detail", deliveryDetailRoute);
app.use("/api/advertisement", advertisementRoutes);

app.use("/api/faq", faqRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/legal",legalRoutes)
app.use("/api/notification",notificationRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/cart",cartRoute);
app.use("/api/address",addressRoute)
app.use("/api/order",orderRoute);
app.use("/api/wishlist",wishlistRoute);
app.use("/api/review",review)
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/payment-setup", paymentSetupRoutes);
app.use("/api/company-info",companyInfo)


module.exports= app;