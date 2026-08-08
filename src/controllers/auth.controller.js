const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
const crypto= require("crypto");
const nodemailer = require("nodemailer");
const {sendForgotPassword} = require("../services/email")
const bcrypt= require("bcrypt")


const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserAlreadyExist = await User.findOne({ email });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
});

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const Login = async (req, res) => {

  try {
    const { email, password } = req.body

  

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password is required for Login"
      })
    }

    const user = await User.findOne({
      email
    })
    if (!user) {
      return res.status(404).json({
        message: "User Not found using this emailId"
      })
    }
       console.log("Password in DB:", user.password);
      

    const hashPassword = await user.comparePassword(password)

        console.log("Password Match:", hashPassword);


    if (!hashPassword) {
      return res.status(401).json(
        {
          message: "Invalid Email and Password"
        }
      )
    }


    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/"
});

    res.status(200).json({
      message: "Login Sucessfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin,
    addresses: user.addresses,

      },
    
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.message
    })
  }
}


const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log("Raw Token:", resetToken);
    console.log("Hashed Token:", hashedToken);
    console.log("Stored Token:", user.resetPasswordToken);
    console.log("Expiry:", user.resetPasswordExpires);

  const resetUrl = `https://e-commerce-frontend-hiw3.onrender.com/reset-password/${resetToken}`;

    await sendForgotPassword(user.email, user.firstName, resetUrl);

    return res.status(200).json({
      message: "Password reset link generated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Token from URL:", token);

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("Hashed Token:", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or Expired Link",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });


    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const Profile = async (req, res) => {

    const user = req.user;

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin,
            addresses: user.addresses,
        }
    });

};
const UpdateProfile = async (req, res) => {

    try {

        const user = req.user;

        const {
            firstName,
            lastName,
            phoneNumber
        } = req.body;

        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            user
        });

    } catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}
const AddAddress = async (req,res)=>{

    try{

        const user = req.user;

        const {
            fullName,
            phoneNumber,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault
        } = req.body;

        if(isDefault){

            user.addresses.forEach(address=>{
                address.isDefault = false;
            });

        }

        user.addresses.push({
            fullName,
            phoneNumber,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault
        });

        await user.save();

        res.status(201).json({
            success:true,
            message:"Address Added Successfully",
            addresses:user.addresses
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}
const GetAddresses = async(req,res)=>{

    try{

        const user = req.user;

        res.status(200).json({
            success:true,
            addresses:user.addresses
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}
const DeleteAddress = async(req,res)=>{

    try{

        const user = req.user;

        user.addresses = user.addresses.filter(
            address => address._id.toString() !== req.params.id
        );

        await user.save();

        res.status(200).json({
            success:true,
            message:"Address Deleted Successfully"
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}


module.exports={Register,Login,ForgotPassword,ResetPassword,Logout,Profile,UpdateProfile,AddAddress,GetAddresses,DeleteAddress}
