const User = require("../models/user.model");

const addAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !phoneNumber ||
      !street ||
      !city ||
      !state ||
      !zipCode
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this address is default,
    // remove default from previous addresses
    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    // If it's the first address,
    // make it default automatically
    const newAddress = {
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country: country || "India",
      isDefault:
        user.addresses.length === 0 ? true : Boolean(isDefault),
    };

    // Add new address
user.addresses = [newAddress];

    // Save user
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getAddress= async(req,res)=>{
  try{
  const userId = req.userId;

  const user = await User.findById(userId);

  if(!user){
    return res.status (400).json({
      success:false,
      message:"User not found"
    })
  }

  res.status(200).json({
    success:true,
  address:  user.addresses,
  })
  }catch(err){
        res.status(500).json({
      success: false,
      message: err.message,
    });
  }

}

const updateAddress= async(req,res)=>{
  try{
    const userId= req.userId;

    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

      const addressId = req.params.addressId;

    const address = user.addresses.id(addressId);

    if(!address){
        return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      fullName,phoneNumber,street,city,state,zipCode,country,isDefault
    }= req.body;

    if(fullName){
      address.fullName = fullName;
    }
    if(phoneNumber){
      address.phoneNumber= phoneNumber;
    }
if(street){
  address.street= street
}
if(city){
  address.city = city;
}
if(state){
  address.state= state
}
  if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;

if (isDefault) {
    user.addresses.forEach(item=>{
        item.isDefault=false;
    });

    address.isDefault=true;
}

await user.save();

res.status(200).json({
  success:true,
  message:"Address updated successfully",
  addresses:user.addresses
})
  }catch(err){
      res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find address
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Check whether it was the default address
    const wasDefault = address.isDefault;

    // Delete address
    address.deleteOne();
    // OR user.addresses.pull(addressId);

    // If default address was deleted,
    // make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addAddress,getAddress,updateAddress,deleteAddress
};