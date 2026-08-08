const mongoose = require("mongoose");

const BankOffer= require("../models/bankOffer.model");

const addBankOffer = async (req, res) => {
  try {
    const { detail } = req.body;

    if (!detail) {
      return res.status(400).json({
        success: false,
        message: "Detail is required",
      });
    }

    const bankOffer = await BankOffer.create({
      detail,
    });

    res.status(201).json({
      success: true,
      message: "Bank offer added successfully",
      bankOffer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBankOffer= async(req,res)=>{
  try{
  const bankOffer = await BankOffer.find({
    isActive:true
  });


    res.status(200).json({
      success: true,
      bankOffer,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}

const getAllBankOfferAdmin= async(req,res)=>{
  try{
  const bankOffer = await BankOffer.find();


    res.status(200).json({
      success: true,
      bankOffer,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getSingleBankOffer= async(req,res)=>{
  try{
  const bankOffer= await BankOffer.findById(req.params.id);

  if(!bankOffer){
    return res.status(404).json({
      success:false,
      message:"No Bank offer find by this Id"
    })
  }
    res.status(200).json({
      success: true,
      bankOffer,
    });
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }


}

const updateBankOffer= async(req,res)=>{
  try{
    const bankOffer =await  BankOffer.findByIdAndUpdate(req.params.id, req.body,{
      new:true,
      runValidators:true
    })

  if(!bankOffer){
    return res.status(404).json({
      success:false,
      message:"No Bank offer find by this Id"
    })
  }
    res.status(200).json({
      success: true,
      bankOffer,
    });



  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteBankOffer=async(req,res)=>{
  try{
  const bankOffer = await BankOffer.findByIdAndDelete(req.params.id);

  if(!bankOffer){
      return res.status(404).json({
      success:false,
      message:"Bank Offer  not found"
    })
  }
    res.status(200).json({
    success:true,
    message:"Bank Offer  deleted successfully"
  })
  }catch(err){
      res.status(500).json({
      success:false,
      message:err.message
    })
  }

}

const toggleBankOffer=async(req,res)=>{
  try{
  const bankOffer = await BankOffer.findById(req.params.id);

  if(!bankOffer){
      return res.status(404).json({
        success: false,
        message: "Bank Offer not found",
      });
  }

  bankOffer.isActive = !bankOffer.isActive;

  await bankOffer.save();

    res.status(200).json({
      success: true,
      message: bankOffer.isActive
        ? "Bank OfferActivated"
        : "Bank Offer Deactivated",
      isActive: bankOffer.isActive,
    });
  }catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

module.exports ={
  addBankOffer,getAllBankOffer,getAllBankOfferAdmin,getSingleBankOffer,updateBankOffer,deleteBankOffer,toggleBankOffer
}