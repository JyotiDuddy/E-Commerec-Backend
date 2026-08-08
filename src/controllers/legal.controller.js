const { search } = require("../app");
const LegalModel = require("../models/legal.model");


const addLegalDocument = async (req, res) => {
  try {
    const {
      type, title, shortDescription, fullContent, isActive
    } = req.body;

    if (!type || !title || !shortDescription || !fullContent ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required to create legal document"
      })
    }

    const allowedTypes = ["terms","about", "privacy_policy", "delivery_policy", "return_policy","career"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type"

      })
    }

    if (isActive) {
      await LegalModel.updateMany({
        type: type,
        isActive: true,
      },
        {
          isActive: false
        })
    }
    const legalDocument = await LegalModel.create({
      type,
      title,
      shortDescription,
      fullContent,
      isActive,

    })

    res.status(201).json({
      success: true,
      message: "Legal document created successfully",
      legalDocument,

    })


  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }

}


const getAllLegalDocumentAdmin = async (req, res) => {
  try {
    const { page=1, limit=10, search, type, isActive } = req.query;

    const filter = {};

    if (type) {
      filter.type = type
    }
    if (isActive === "true") {
      filter.isActive = true
    }
    if (isActive === "false") {
      filter.isActive = false
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          shortDescription: {
            $regex: search,
            $options: "i"
          }
        }
      ]
    }

    const currentPage = Number(page);

    const perPage = Number(limit);

    const skip = (currentPage - 1) * perPage;

    const legalDoc = await LegalModel.find(filter).sort({
      createdAt: -1
    }).skip(skip).limit(perPage)

    const totalDocs = await LegalModel.countDocuments(filter);

    const totalPages = Math.ceil(totalDocs / perPage);

    res.status(200).json({
      success: true,
      count: legalDoc.length,
      legalDoc,
      totalDocs,
      totalPages,
      page: currentPage,
      hasNextPage: currentPage < totalPages,
      limit:perPage,
      hasPrevPage: currentPage > 1,


    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getSingleLegalDocument = async (req, res) => {
  try {
    const legal =await  LegalModel.findById(req.params.id);

    if (!legal) {
      return res.status(404).json({
        success: false,

        message: "No legal Document found by thi id ",
      })
    }

    res.status(200).json({
      success: true,
      legal
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}
const updatelegalDocument = async(req,res)=>{

    try {
    const legal =await  LegalModel.findById(req.params.id);
  
    if (!legal) {
      return res.status(404).json({
        success: false,

        message: "No legal Document found by thi id ",
      })
    }

  
  if(req.body.isActive === true){
    await LegalModel.updateMany({
      type:legal.type,
      isActive:true,
      _id:{$ne:legal._id}
    },{
      isActive:false
    })
  }
  const updatedLegal=  await LegalModel.findByIdAndUpdate(req.params.id,req.body,{
     runValidators:true,
     new:true
  })

    res.status(200).json({
      success: true,
      message: "Legal document updated successfully",
      legalDocument: updatedLegal,
    });

  }catch(err){
  res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteLegalDocument = async(req,res)=>{
  try{
  const legal= await LegalModel.findByIdAndDelete(req.params.id);

  if(!legal){
    return res.status(404).json({
      success:false,
      message:"Legal Document not found by this id. "
    })
  }

  res.status(200).json({
    success:true,
    message:"Legal Document deleted successfully"
  })

  }catch(err){
        res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const getLegalDocument = async (req, res) => {
  try {
    const { type } = req.params;

    const allowedTypes = ["terms","about", "privacy_policy", "delivery_policy", "return_policy","career"]

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal document type",
      });
    }

    const legalDocument = await LegalModel.findOne({
      type,
      isActive: true,
    });

    if (!legalDocument) {
      return res.status(404).json({
        success: false,
        message: "Legal document not found",
      });
    }

    res.status(200).json({
      success: true,
      legalDocument,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = { addLegalDocument, getAllLegalDocumentAdmin, getSingleLegalDocument,updatelegalDocument,deleteLegalDocument ,getLegalDocument}