const CompanyInfo = require("../models/companyInfo.model");


const addCompanyInfo = async (req, res) => {
  try {
    const { companyName,
      companyLogo,
      themeColor,
      shortDescription,
      companyAddress,
      companyMail,
      companyNumber,
      supportMail,
      customerSupport,
      
   } = req.body;

    console.log(req.body);

    if (!companyName ||
      !companyLogo ||
      !themeColor ||
      !shortDescription ||
      !companyAddress ||
      !companyMail ||
      !companyNumber ||
      !supportMail ||
      !customerSupport 
      ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to creaete company Info"

      })

    }
    await CompanyInfo.updateMany(
  { isActive: true },
  { isActive: false }
);
  const companyInfo=  await CompanyInfo.create({
    companyName,
companyLogo,
themeColor,
shortDescription,
companyAddress,
companyMail,
companyNumber,
supportMail,
customerSupport,
socialLinks: req.body.socialLinks || [],

isActive:true

    })
    console.log(companyInfo);
    res.status(201).json({
      success:true,
      message:"CompanyInfo created successfully",
      companyInfo

    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}
const updateCompanyInfo=async(req,res)=>{
  try{
    const companyInfo= await CompanyInfo.findByIdAndUpdate(  req.params.id,req.body,{
      new:true,
      runValidators:true
    })
    if(!companyInfo){
      return res.status(404).json({
        success:false,
        message:"Company Info not found"
      })
    }
    res.status(200).json({
      success:true,
      companyInfo
    })

  }catch(err){
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const adminGetAllcompanyInfo = async(req,res)=>{
  try{
  const companyInfo= await CompanyInfo.find().sort({
    createdAt:-1
  });
console.log(companyInfo)
  if(companyInfo.length ===  0){
      return res.status(404).json({
      success:false,
      message:"Company Info not found"
    })
  }
      res.status(200).json({
      success: true,
  companyInfo,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}
const getActiveCompanyInfo= async(req,res)=>{
  try{
  const companyInfo=await CompanyInfo.findOne({
    isActive:true
  })
 if(!companyInfo ){
  return res.status(404).json({
    success:false,
    message:"Company Info not found"
  })

 }
   res.status(200).json({
    success:true,
    companyInfo
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}
const getCompanyInfoById = async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findById(req.params.id);

    console.log(companyInfo);

    if (!companyInfo) {
      return res.status(404).json({
        success: false,
        message: "Company Info not found",
      });
    }

    res.status(200).json({
      success: true,
      companyInfo,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const deleteCompanyInfo = async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findByIdAndDelete(req.params.id);

    if (!companyInfo) {
      return res.status(404).json({
        success: false,
        message: "Company Info not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company Info deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const toggleCompanyInfo = async (req, res) => {
  try {
    const { isActive } = req.body;

    const companyInfo = await CompanyInfo.findById(req.params.id);

    if (!companyInfo) {
      return res.status(404).json({
        success: false,
        message: "Company Info not found",
      });
    }

    // If activating this profile, deactivate all others first
    if (isActive) {
      await CompanyInfo.updateMany(
        { _id: { $ne: req.params.id } },
        { isActive: false }
      );
    }

    companyInfo.isActive = isActive;
    await companyInfo.save();

    res.status(200).json({
      success: true,
      message: `Company profile ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      companyInfo,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports= {addCompanyInfo,adminGetAllcompanyInfo,updateCompanyInfo,getActiveCompanyInfo,getCompanyInfoById,deleteCompanyInfo,toggleCompanyInfo}