const Product = require("../models/product.model");
const ProductType = require("../models/productType.model");
const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
const BankOffer = require("../models/bankOffer.model");
const DeliveryDetail = require("../models/deliveryDetail.model");

const addProduct = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      subCategory,
      brand,
      price,  
      discount,
      images,
      rating,
      quantity,
      descriptions,
      bankOffers,
      deliveryDetails,
      reviews,
      isFeatured,
      isSponsored,
      isActive,
    } = req.body;

    // Required Fields
    if (!title || !type || !category || !subCategory || !brand || price == null) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check Product Type
    const productType = await ProductType.findById(type);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found",
      });
    }

    // Check Category
    const productCategory = await Category.findById(category);

    if (!productCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check Category belongs to Product Type
    if (productCategory.type.toString() !== type) {
      return res.status(400).json({
        success: false,
        message: "Category does not belong to selected Product Type",
      });
    }

    // Check Sub Category
    const subCategoryData = await SubCategory.findById(subCategory);

    if (!subCategoryData) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    // Check Sub Category belongs to Category
    if (subCategoryData.category.toString() !== category) {
      return res.status(400).json({
        success: false,
        message: "Sub Category does not belong to selected Category",
      });
    }

    // Validate Bank Offers
    if (bankOffers && bankOffers.length > 0) {
      const offers = await BankOffer.find({
        _id: { $in: bankOffers },
      });

      if (offers.length !== bankOffers.length) {
        return res.status(404).json({
          success: false,
          message: "One or more Bank Offers not found",
        });
      }
    }

    // Validate Delivery Details
    if (deliveryDetails && deliveryDetails.length > 0) {
      const details = await DeliveryDetail.find({
        _id: { $in: deliveryDetails },
      });

      if (details.length !== deliveryDetails.length) {
        return res.status(404).json({
          success: false,
          message: "One or more Delivery Details not found",
        });
      }
    }

    // Create Product
    const product = await Product.create({
      title,
      type,
      category,
      subCategory,
      brand,
      price,
      discount,
      images,
      rating,
      quantity,
      descriptions,
      bankOffers,
      deliveryDetails,
      reviews,
      isFeatured,
      isSponsored,
      isActive,
    });

    // Populate References
    await product.populate([
      { path: "type" },
      { path: "category" },
      { path: "subCategory" },
      { path: "bankOffers" },
      { path: "deliveryDetails" },
    ]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getSingleProduct= async(req,res)=>{
  try{

  const product=await  Product.findById(req.params.id);

    if(!product){
  return  res.status(404).json({
      success:false,
      message:"Product not found"
    })
  }

  await product.populate([
    "type","category","subCategory","bankOffers","deliveryDetails"
  ])
  res.status(200).json({
    success:true,
    product
  })
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }


}
 
const getAllProductAdmin= async(req,res)=>{
  try{
  const products = await Product.find().populate([
    "type","category","subCategory","bankOffers","deliveryDetails"
  ]);

  res.status(200).json({
    success:true,
    products
  })
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


const updateProdut = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      type,
      category,
      subCategory,
      bankOffers,
      deliveryDetails,
    } = req.body;

    // Validate Product Type
    if (type) {
      const productType = await ProductType.findById(type);

      if (!productType) {
        return res.status(404).json({
          success: false,
          message: "Product Type not found",
        });
      }
    }

    // Validate Category
    if (category) {
      const productCategory = await Category.findById(category);

      if (!productCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      if (type && productCategory.type.toString() !== type) {
        return res.status(400).json({
          success: false,
          message: "Category does not belong to Product Type",
        });
      }
    }

    // Validate Sub Category
    if (subCategory) {
      const productSubCategory = await SubCategory.findById(subCategory);

      if (!productSubCategory) {
        return res.status(404).json({
          success: false,
          message: "Sub Category not found",
        });
      }

      if (category && productSubCategory.category.toString() !== category) {
        return res.status(400).json({
          success: false,
          message: "Sub Category does not belong to Category",
        });
      }
    }

    // Validate Bank Offers
    if (bankOffers && bankOffers.length > 0) {
      const offers = await BankOffer.find({
        _id: { $in: bankOffers },
      });

      if (offers.length !== bankOffers.length) {
        return res.status(404).json({
          success: false,
          message: "One or more Bank Offers not found",
        });
      }
    }

    // Validate Delivery Details
    if (deliveryDetails && deliveryDetails.length > 0) {
      const details = await DeliveryDetail.find({
        _id: { $in: deliveryDetails },
      });

      if (details.length !== deliveryDetails.length) {
        return res.status(404).json({
          success: false,
          message: "One or more Delivery Details not found",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate([
      "type",
      "category",
      "subCategory",
      "bankOffers",
      "deliveryDetails",
    ]);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const toggleProduct=async(req,res)=>{
  try{
  const product= await Product.findById(req.params.id);

  if(!product){
    return res.status(404).json({
      success:false,
      message:"Product not found"
    })
  }

  product.isActive = !product.isActive;

  await product.save();
  res.status(200).json({
    success:true,
    message:product.isActive? "Product Activated":"Product Deactivated"
  })

  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      subCategory,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      search,
      isFeatured,
      isSponsored,
    } = req.query;

    // -------------------------
    // Filters
    // -------------------------
    const filter = {
      isActive: true,
    };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    if (minPrice) {
      filter.price = {
        ...filter.price,
        $gte: Number(minPrice),
      };
    }

    if (maxPrice) {
      filter.price = {
        ...filter.price,
        $lte: Number(maxPrice),
      };
    }

    if (minDiscount) {
      filter.discount = {
        $gte: Number(minDiscount),
      };
    }

    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    if (isSponsored === "true") {
      filter.isSponsored = true;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -------------------------
    // Sorting
    // -------------------------
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "pricelowtohigh":
        sortOption = { price: 1 };
        break;

      case "pricehightolow":
        sortOption = { price: -1 };
        break;

      case "toprated":
        sortOption = { rating: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
    }

    // -------------------------
    // Pagination
    // -------------------------
    const currentPage = Number(page);
    const perPage = Number(limit);

    const skip = (currentPage - 1) * perPage;

    // -------------------------
    // Get Products
    // -------------------------
    const products = await Product.find(filter)
      .populate([
        "type",
        "category",
        "subCategory",
        "bankOffers",
        "deliveryDetails",
      ])
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    // -------------------------
    // Count Documents
    // -------------------------
    const totalDocs = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalDocs / perPage);

    // -------------------------
    // Response
    // -------------------------
    res.status(200).json({
      success: true,
      products,
      totalDocs,
      totalPages,
      page: currentPage,
      limit: perPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    }).populate([
      "type",
      "category",
      "subCategory",
      "bankOffers",
      "deliveryDetails",
    ]);

    res.status(200).json({
      success: true,
      products,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSponsoredProducts = async (req, res) => {
  try {

    const products = await Product.find({
      isSponsored: true,
      isActive: true,
    }).populate([
      "type",
      "category",
      "subCategory",
      "bankOffers",
      "deliveryDetails",
    ]);

    res.status(200).json({
      success: true,
      products,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const addReview = async (req, res) => {
  try {

    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "User, Rating and Comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.reviews.push({
      user,
      rating,
      comment,
    });

    const total = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    product.rating = Number(
      (total / product.reviews.length).toFixed(1)
    );

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      rating: product.rating,
      reviews: product.reviews,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {

    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.deleteOne();

    if (product.reviews.length > 0) {

      const totalRating = product.reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      );

      product.rating = Number(
        (totalRating / product.reviews.length).toFixed(1)
      );

    } else {
      product.rating = 0;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      rating: product.rating,
      reviews: product.reviews,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addProduct,getSingleProduct,updateProdut,getAllProductAdmin,deleteProduct,toggleProduct,getAllProducts,getFeaturedProducts,getSponsoredProducts,addReview,deleteReview
};