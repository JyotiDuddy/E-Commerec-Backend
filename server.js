require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT;

console.log(process.env.RAZORPAY_API_KEY);



app.listen(PORT,()=>{
  connectDB()
  console.log(`Server is running on ${PORT}`)
})
