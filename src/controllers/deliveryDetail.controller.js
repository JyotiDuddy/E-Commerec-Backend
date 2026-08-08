const mongoose = require("mongoose");

const DeliveryDetail= require("../models/deliveryDetail.model");

const addDeliveryDetail = async (req, res) => {
  try {
    const { detail } = req.body;

    if (!detail) {
      return res.status(400).json({
        success: false,
        message: "Detail is required",
      });
    }

    const deliveryDetail = await DeliveryDetail.create({
      detail,
    });

    res.status(201).json({
      success: true,
      message: "Delivery Detail added successfully",
      deliveryDetail,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllDeliveryDetail= async(req,res)=>{
  try{
  const deliveryDetail  = await DeliveryDetail.find({
    isActive:true
  });


    res.status(200).json({
      success: true,
    deliveryDetail,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}

const getAlldeliveryDetailAdmin= async(req,res)=>{
  try{
  const deliveryDetail = await DeliveryDetail.find();


    res.status(200).json({
      success: true,
    deliveryDetail,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getSingleDeliveryDetail= async(req,res)=>{
  try{
  const deliveryDetail= await DeliveryDetail.findById(req.params.id);

  if(!deliveryDetail){
    return res.status(404).json({
      success:false,
      message:"No Delivery Detail  find by this Id"
    })
  }
    res.status(200).json({
      success: true,
    deliveryDetail,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}

const updateDeliveryDetail= async(req,res)=>{
  try{
    const deliveryDetail =await  DeliveryDetail.findByIdAndUpdate(req.params.id, req.body,{
      new:true,
      runValidators:true
    })

  if(!deliveryDetail){
    return res.status(404).json({
      success:false,
      message:"No Delivery Detail find by this Id"
    })
  }
    res.status(200).json({
      success: true,
    deliveryDetail,
    });



  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteDeliveryDetail=async(req,res)=>{
  try{
  const deliveryDetail = await DeliveryDetail.findByIdAndDelete(req.params.id);

  if(!deliveryDetail){
      return res.status(404).json({
      success:false,
      message:"Delivery Detail  not found"
    })
  }
    res.status(200).json({
    success:true,
    message:"Delivery Detail  deleted successfully"
  })
  }catch(err){
      res.status(500).json({
      success:false,
      message:err.message
    })
  }

}

const toggleDeliveryDetail=async(req,res)=>{
  try{
  const deliveryDetail = await DeliveryDetail.findById(req.params.id);

  if(!deliveryDetail){
      return res.status(404).json({
        success: false,
        message: "Delivery Detail not found",
      });
  }

  deliveryDetail.isActive = !deliveryDetail.isActive;

  await deliveryDetail.save();

    res.status(200).json({
      success: true,
      message: deliveryDetail.isActive
        ? "Delivery Detail Activated"
        : "Delivery Detail Deactivated",
      isActive: deliveryDetail.isActive,
    });
  }catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

module.exports ={
  addDeliveryDetail,getAllDeliveryDetail,getAlldeliveryDetailAdmin,getSingleDeliveryDetail,updateDeliveryDetail,deleteDeliveryDetail,toggleDeliveryDetail
}