const User= require("../models/user.model");
const jwt= require("jsonwebtoken")


const authMiddleware= async(req,res,next)=>{
  const {token} = req.cookies;

  if(!token){
    return res.status(401).json({
      message:"Unauthorized",
    })
  }

  try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET)

  if(!decoded){
    return res.status(401).json({
      message:"Invalid Token"
    })
  }

  const user = await User.findById(decoded.id);

  if(!user){
    return res.status(404).json({
      message:"User not found "
    })
  }

  req.user = user;
  req.userId = user._id;


  next()

  }catch(err){
  console.log(err);
    return res.status(401).json({
    success: false,
    message: "Invalid or expired token",
  });

  }




}

module.exports = {authMiddleware}