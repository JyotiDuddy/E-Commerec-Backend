const mongoose = require("mongoose");

const connectDB=async()=>{
  try{
  await mongoose.connect(process.env.MONGO_URI)
  console.log(`MONGODB Connected`)
  }
  catch(err){
      console.error(err);
   console.error("MONGODB connection Error , err")
  }
}

module.exports = connectDB