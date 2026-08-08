const FAQ = require("../models/faq.model");


const addFaq=async(req,res)=>{
  try{
  const{question,answer,isActive} = req.body;

  if(!question || !answer){
   return res.status(404).json({
    success:false,
    message:"All fields are required to create faq"
   })
  }
const faq = await FAQ.create({
    question,
    answer,
    isActive:true
});
  res.status(201).json({
    success:true,
    message:"Faq created successfully",
    faq
  })
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })

  }

}

const adminGetAllFaq = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;

    // Filter
    const filter = {};

    if (isActive === "true") {
      filter.isActive = true;
    }

    if (isActive === "false") {
      filter.isActive = false;
    }

    // Search
    if (search) {
      filter.$or = [
        {
          question: {
            $regex: search,
            $options: "i",
          },
        },
        {
          answer: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Pagination
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    // Fetch FAQs
    const faqs = await FAQ.find(filter)
     .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    // Count
    const totalDocs = await FAQ.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / perPage);

  res.status(200).json({
    success: true,
    count: faqs.length,
    faqs,
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

const getSingleFaq= async(req,res)=>{
  try{
  const faq= await FAQ.findById(req.params.id);

  if(!faq){
    return res.status(404).json({
      success:false,
      message:"Faq not found"
    })
  }

  res.status(200).json({
    success:true,
    message:"Faq found",
    faq
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    })
  }

}
const updateFaq= async(req,res)=>{
  try{
  const faq= await FAQ.findByIdAndUpdate(req.params.id,req.body,{
    runValidators:true,
    new:true
  })

  if(!faq){
    return res.status(404).json({
      success:false,
      message:"Faq not found"
    })
  }
  res.status(200).json({
    success:true,
    faq
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message
    })
  }


}
const toggleFaq= async(req,res)=>{
try{
  const faq= await FAQ.findById
  (req.params.id);

  if(!faq){
    return res.status(404).json({
      success:false,
      message:"Faq not found"
    })
  }

  faq.isActive = !faq.isActive;

  await faq.save();

  res.status(200).json({
    success:true,
    message:faq.isActive ? "Faq Activated":"Faq Deactivated"
  })
}catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
}

}

const deleteFaq= async(req,res)=>{
  try{
  const faq= await FAQ.findByIdAndDelete(req.params.id);

  if(!faq){
    return res.status(404).json({
      success:false,
      message:"Faq not found"
    })
  }
  res.status(200).json({
    success:true,
    message:"faq deleted successfully"
  })
  }catch(err){
  res.status(500).json({
      success: false,
      message: err.message,
    });
}

}

const getallFaqs= async(req,res)=>{
  try{
    const faq= await FAQ.find({
      isActive:true
    }).sort({
      createdAt:1
    });

    if(faq.length === 0 ){
      return res.status(404).json({
        success:false,
        message:"Faq not found"
      })
    }
    res.status(200).json({
      success:true,
      faq
    })

  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

module.exports = {addFaq,adminGetAllFaq,getSingleFaq,updateFaq,toggleFaq,deleteFaq,getallFaqs}