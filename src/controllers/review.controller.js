const Product = require("../models/product.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

const createReview=async(req,res)=>{
  try{
  const userId= req.userId
  const {productId,review,rating,comment} = req.body;

    // Validation
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product, rating and comment are required",
      });
    }


    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }





const product =await Product.findById(productId);

if (!product) {
    return res.status(404).json({
        success:false,
        message:"Product not found"
    });
}



const reviews = await Review.findById({
  user:userId,
  product:productId
});

if(reviews){
  return res.status(400).json({
    success:false,
    message:"Already Reviewed"
  })
}

const rev= await Review.create({
   user: userId,
      product: productId,
  rating,
  comment
}).populate("user","firstName lastName email phoneNumber").populate("product","title type brand price image");

res.status(201).json({
  success:true,
  rev
})

  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }



}

const getProductReviews= async(req,res)=>{
  try{
    const {productId} = req.params;

    const product= await Product.findById(productId);

    if(!product){
        return res.status(404).json({
        success:false,
        message:"Product not found"
    });
    }

    const review= await Review.find({
      product:productId
    }).populate("user","firstName lastName").sort({
      createdAt:-1
    });

   res.status(200).json({
    success:true,
    count:review.length,
    review
   })

  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


const updateReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    const { rating, comment } = req.body;

    // Find review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if nothing to update
    if (!rating && !comment) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    // Update fields
    if (rating) {
      review.rating = rating;
    }

    if (comment) {
      review.comment = comment;
    }

    await review.save();

    await review.populate("user", "firstName lastName email phoneNumber");

    await review.populate("product", "title price image");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const deleteReview= async(req,res)=>{
  try{
  const {reviewId} = req.params;

  const userId = req.userId;

  const{rating,comment}= req.body;


  const review=await  Review.findById(reviewId);

  if(!review){
    return res.status(404).json({
      success:false,
      message:"No revoiew found by thie reviewId"
    })
  }

  const user = await User.findById(userId);

  if(review.user.toString() !== req.userId){
    return res.status(404).json({
      success:false,
      message:"Unauthorized",
    })
  }

await review.deleteOne();

res.status(200).json({
    "success": true,
    "message": "Review deleted successfully"
})
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const adminGetAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate(
        "user",
        "firstName lastName email phoneNumber"
      )
      .populate(
        "product",
        "title price image brand"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



module.exports={createReview,getProductReviews,updateReview,deleteReview,adminGetAllReviews}