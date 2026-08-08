const mongoose = require("mongoose");
const bcrypt= require("bcrypt")


const userSchema= new mongoose.Schema({
  firstName:{
    type:String,
    required:[true,"FirstName is required"],
  },
    lastName:{
    type:String,
    required:[true,"LastName is required"],
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    lowercase:true,
    trim:true

  },
phoneNumber:{
    type:String,
    required:[true,"Phone number is required"]
},
  password:{
    type:String,
    required:[true,"Pssword is required"],
    minlength:[6,"Password must be at least 6 character"]
  },
  isAdmin: {
  type: Boolean,
  default: false
},
addresses: [
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
],
  resetPasswordToken:{
    type:String,
    default:null
  },
  resetPasswordExpires:{
    type:Date,
    default:null
  },
  refreshToken: {
    type: String,
    default: null,
},


},
{
  timestamps:true
})


userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User",userSchema);

module.exports = userModel 