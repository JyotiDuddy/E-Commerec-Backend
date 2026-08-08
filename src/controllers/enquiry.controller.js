
const Enquiry = require("../models/enquiry.model");


const addEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message} = req.body;

    if (!name || !email || !phone || !subject||!message ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create enquiry "
      })
    }
    const enquiry = await Enquiry.create({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

}

const adminGetAllEnquiry = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const filter = {};

  if (status) {
    filter.status = status;
}
    if (search) {
      filter.$or = [
        {
          name: {
            $regex:search,
            $options: "i"
          }

        },
        {
          email: {
            $regex:search,
            $options: "i"
          }

        },
        {
          phone: {
            $regex:search,
            $options: "i"
          }

        },
        {
          subject: {
            $regex:search,
            $options: "i"
          }

        },
      ]
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    // Fetch Enquiry
    const enquiry = await Enquiry.find(filter).sort({
    createdAt: -1
}).skip(skip).limit(perPage);

    const totalDocs= await Enquiry.countDocuments(filter);
    const totalPages= Math.ceil(totalDocs/perPage)
  res.status(200).json({
    success: true,
    count: enquiry.length,
  enquiries:enquiry,
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
}
const getSingleEnquiry= async(req,res)=>{
  try{
  const enquiry= await Enquiry.findById(req.params.id);

  if(!enquiry){
    return res.status(404).json({
      success:false,
      message:"Enquiry not found by this id"
    })
  }
  res.status(200).json({
    success:true,
    enquiry
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const updateEnquiryStatus= async(req,res)=>{
  try{
      const { status, remark } = req.body;

  if (!status || !remark) {
  return res.status(400).json({
    success: false,
    message: "Status and remark are required",
  });
}
  const allowedStatus=[
    "new","in-progress","fulfilled","rejected"
  ]
  const trimmedStatus = status?.trim();
  if (!allowedStatus.includes(trimmedStatus)) {
  return res.status(400).json({
    success: false,
    message: "Invalid status",
  });
}
const enquiry = await Enquiry.findById(req.params.id);

if (!enquiry) {
  return res.status(404).json({
    success: false,
    message: "Enquiry not found",
  });
}
enquiry.status = trimmedStatus;
enquiry.remark = remark.trim();

   await enquiry.save();

  res.status(200).json({
  success: true,
  message: "Enquiry status updated successfully",
  enquiry,
});
  }catch(err){
  res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}
const deleteEnquiry= async(req,res)=>{
  try{
      const enquiry = await Enquiry.findByIdAndDelete(req.params.id)
      if(!enquiry){
    return res.status(404).json({
      success:false,
      message:"enquiry  not found"
    })
  }
  res.status(200).json({
    success:true,
    message:"enquiry deleted successfully"
  })
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}


module.exports={adminGetAllEnquiry,addEnquiry,getSingleEnquiry,updateEnquiryStatus,deleteEnquiry}