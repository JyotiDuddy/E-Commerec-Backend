const Advertisement = require("../models/advertisement.model");


const addAdvertisement = async (req, res) => {

  try {
    const { title, advertiser, bannerImage, headline, subText, buttonText, redirectType, redirectUrl, showOnHome, showOnList, showOnView, priority, isActive, startDate, endDate } = req.body;

    if (
      !title ||
      !advertiser ||
      !bannerImage ||
      !headline ||
      !redirectUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })

    }

    if (
      redirectType &&
      !["external", "internal"].includes(redirectType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid redirect type"
      });
    }

    const advertisement = await Advertisement.create({
      title, advertiser, bannerImage, headline, subText, buttonText, redirectType, redirectUrl, showOnHome, showOnList, showOnView, priority, isActive, startDate, endDate
    })

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      advertisement
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const adminGetAllAdvertisements = async (req, res) => {
  try {
  


    const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 5;

const skip = (page - 1) * limit;

const advertisements = await Advertisement.find()
    .skip(skip)
    .limit(limit);

const totalDocs = await Advertisement.countDocuments();
    res.status(200).json({
      success: true,
      advertisements,
      totalDocs
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getSingleAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found"
      })
    }
    res.status(200).json({
      success: true,
      advertisement
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const updateAdvertisement= async(req,res)=>{
  try{
  const advertisement = await Advertisement.findByIdAndUpdate(
  req.params.id,
  req.body,
  {
    new: true,
    runValidators: true,
  }
);

  if(!advertisement){
      return res.status(404).json({
        success: false,
        message: "Advertisement not found"
      })
  }
    res.status(200).json({
      success: true,
      advertisement
    })

  }catch(err){
  res.status(500).json({
      success: false,
      message: err.message
    })
  }
  
}
const toggleAdvertisement= async(req,res)=>{
  try{
  const advertisement = await Advertisement.findById(req.params.id);

  if(!advertisement){
      return res.status(404).json
    ({
        success: false,
        message: "Advertisement not found"
      })
  }

advertisement.isActive = !advertisement.isActive;

  await advertisement.save();

  res.status(200).json({
    success:true,
    message:advertisement.isActive? "Advertisement Activated":"Advertisement Deactivated",
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}
const deleteAdvertisement= async(req,res)=>{
  try{
  const advertisement = await Advertisement.findByIdAndDelete(req.params.id);

  if(!advertisement){
    return res.status(404).json({
      success:false,
      message:"Advertisement not found",
    })
  }

  res.status(200).json({
    success:true,
    message:"Advertisement Deleted successfully"
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }



}

const getAllAdvertisement= async(req,res)=>{
  try{
    const advertisement= await Advertisement.find({
      isActive:true
    })

    if(advertisement.length === 0){
      return res.status(404).json({
        success:false,
        message:"Advertisment not found"
      })
    }
    res.status(200).json({
      success:true,
      advertisement
    })

  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getHomeAdvertisements= async(req,res)=>{
  try{
  const advertisement= await Advertisement.find({
    isActive:true,
    showOnHome:true,
  $or:[
    {endDate:null},
    {endDate :{$gte:new Date()}}
  ]
  }).sort({
    priority:-1
  })

  if(advertisement.length === 0 ){
    return res.status(404).json({
      success:false,
      message:"No Advertisement found"
    })
  }



  res.status(200).json({
    success:true,
    advertisement
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }



}
const getListAdvertisement=async(req,res)=>{
    try{
  const advertisement= await Advertisement.find({
    isActive:true,
    showOnList:true,
  $or:[
    {endDate:null},
    {endDate :{$gte:new Date()}}
  ]
  }).sort({
    priority:-1
  })

  if(advertisement.length === 0 ){
    return res.status(404).json({
      success:false,
      message:"No Advertisement found"
    })
  }



  res.status(200).json({
    success:true,
    advertisement
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
const getViewAdvertisement=async(req,res)=>{
    try{
  const advertisement= await Advertisement.find({
    isActive:true,
    showOnView:true,
  $or:[
    {endDate:null},
    {endDate :{$gte:new Date()}}
  ]
  }).sort({
    priority:-1
  })

  if(advertisement.length === 0 ){
    return res.status(404).json({
      success:false,
      message:"No Advertisement found"
    })
  }



  res.status(200).json({
    success:true,
    advertisement
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}





module.exports = { addAdvertisement, adminGetAllAdvertisements,getSingleAdvertisement,updateAdvertisement,toggleAdvertisement, deleteAdvertisement,getAllAdvertisement,getHomeAdvertisements,getListAdvertisement,getViewAdvertisement}