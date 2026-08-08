
const ProductType = require("../models/productType.model");
const Product = require("../models/product.model");
const Advertisement = require("../models/advertisement.model");
const HomePage = require("../models/home.model");



const addHomeSetting= async(req,res)=>{
  try{
  const{carousel,quickPicks,specialOffer,showTypes,showCarousel, showQuickPicks,showTopSelling,showTopRated,showSpecialOffer,showNotifySection,showTestimonial,showAdSection,isActive} = req.body;
  
  
  const newSetting = await HomePage.create({
    carousel:Array.isArray(carousel)?carousel:[],
    quickPicks:Array.isArray(quickPicks)?quickPicks:[],
    specialOffer:specialOffer||{},
    showTypes:showTypes !== undefined ? Boolean(showTypes):true,
      showCarousel: showCarousel !== undefined ? Boolean(showCarousel) : true,
      showQuickPicks:
        showQuickPicks !== undefined ? Boolean(showQuickPicks) : true,
      showTopSelling:
        showTopSelling !== undefined ? Boolean(showTopSelling) : true,
      showTopRated: showTopRated !== undefined ? Boolean(showTopRated) : true,
      showSpecialOffer:
        showSpecialOffer !== undefined ? Boolean(showSpecialOffer) : true,
      showNotifySection:
        showNotifySection !== undefined ? Boolean(showNotifySection) : true,
      showTestimonial:
        showTestimonial !== undefined ? Boolean(showTestimonial) : true,
      showAdSection:
        showAdSection !== undefined ? Boolean(showAdSection) : true,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
  })

  res.status(201).json({
    success:true,
    message:"Home Page setting created successfully",
    settings: newSetting,
  })
  }catch(err){
     console.error(err);
      res.status(500).json({ success: false, error: err.message });
  }

}

const getHomeSetting = async (req, res) => {
  try {
    let settings = await HomePage.findOne({
      isActive: true,
    }).populate("carousel.type", "name");

    if (!settings) {
      settings = await HomePage.create({});
    }

    // Dashboard counts
    const productCount = await Product.countDocuments({
      isActive: true,
    });

    const subscriberCount = 0;
    // OR if you have Subscriber model:
    // const subscriberCount = await Subscriber.countDocuments();

    res.status(200).json({
      success: true,
      settings: {
        ...settings.toObject(),
        productCount,
        subscriberCount,
      },
    });

  } catch (err) {
     console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

 const updateHomeSetting = async(req,res)=>{
  try{
    let settings= await HomePage.findOne({
      isActive:true
    })
      if (!settings) {
      settings = new HomePage({ });
    }

    const {
      carousel,
      quickPicks,
      specialOffer,
      showTypes,
      showCarousel,
      showQuickPicks,
      showTopSelling,
      showTopRated,
      showSpecialOffer,
      showNotifySection,
      showTestimonial,
      showAdSection, isActive,
    } = req.body;

    if (carousel !== undefined) settings.carousel = carousel;
    if (quickPicks !== undefined) settings.quickPicks = quickPicks;
    if (specialOffer !== undefined) settings.specialOffer = specialOffer;

    if (showTypes !== undefined) settings.showTypes = Boolean(showTypes);
    if (showCarousel !== undefined)
      settings.showCarousel = Boolean(showCarousel);
    if (showQuickPicks !== undefined)
      settings.showQuickPicks = Boolean(showQuickPicks);
    if (showTopSelling !== undefined)
      settings.showTopSelling = Boolean(showTopSelling);
    if (showTopRated !== undefined)
      settings.showTopRated = Boolean(showTopRated);
    if (showSpecialOffer !== undefined)
      settings.showSpecialOffer = Boolean(showSpecialOffer);
    if (showNotifySection !== undefined)
      settings.showNotifySection = Boolean(showNotifySection);
    if (showTestimonial !== undefined)
      settings.showTestimonial = Boolean(showTestimonial);
    if (showAdSection !== undefined)
      settings.showAdSection = Boolean(showAdSection);

if (isActive !== undefined)
    settings.isActive = Boolean(isActive);

      await settings.save();
    res.status(200).json({
      success: true,
      msg: "Home page settings updated successfully",
      settings,
    });

  }catch(err){
     console.error(err);
        res.status(500).json({ success: false, error: err.message });
  }
 }

//  Public

const getPublicHomePage = async (req, res) => {
  try {
    const settings = await HomePage.findOne({
      isActive: true,
    }).populate("carousel.type", "name");

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Home page settings not found",
      });
    }

    // Default Response
    const responseData = {
      success: true,
      layout: settings,
      types: [],
      topSellingProducts: [],
      topRatedProducts: [],
      testimonials: [],
      ads: [],
    };

    // 1. Product Types
    if (settings.showTypes) {
      responseData.types = await ProductType.find({
        isActive: true,
      }).select("name image");
    }

    // 2. Top Selling Products
    if (settings.showTopSelling) {
      responseData.topSellingProducts = await Product.find({
        isActive: true,
      })
        .sort({ soldCount: -1 })
        .limit(10)
        .populate("type", "name")
        .populate("category", "name");
    }

    // 3. Top Rated Products
    if (settings.showTopRated) {
      responseData.topRatedProducts = await Product.find({
        isActive: true,
      })
        .sort({ rating: -1 })
        .limit(10)
        .populate("type", "name")
        .populate("category", "name");
    }

    // 4. Testimonials
    if (settings.showTestimonial) {
      responseData.testimonials = await Product.aggregate([
        {
          $match: {
            isActive: true,
            "reviews.0": { $exists: true },
          },
        },
        {
          $unwind: "$reviews",
        },
        {
          $sort: {
            "reviews.rating": -1,
            "reviews.date": -1,
          },
        },
        {
          $limit: 15,
        },
        {
          $project: {
            _id: 0,
            productName: "$title",
            productImage: {
              $arrayElemAt: ["$image", 0],
            },
            user: "$reviews.user",
            rating: "$reviews.rating",
            comment: "$reviews.comment",
            date: "$reviews.date",
          },
        },
      ]);
    }

    // 5. Advertisements
    if (settings.showAdSection) {
      const now = new Date();

      responseData.ads = await Advertisement.find({
        isActive: true,
        showOnHome: true,
        $and: [
          {
            $or: [
              { startDate: null },
              { startDate: { $lte: now } },
            ],
          },
          {
            $or: [
              { endDate: null },
              { endDate: { $gte: now } },
            ],
          },
        ],
      }).sort({
        priority: -1,
      });
    }

    res.status(200).json(responseData);

  } catch (err) {
     console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports={addHomeSetting,getHomeSetting,updateHomeSetting,getPublicHomePage}

