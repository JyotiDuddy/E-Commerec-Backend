const Cart = require("../models/cart.model");
const Product = require("../models/product.model")

const addToCart= async(req,res)=>{
  try{
  const userId = req.userId;

  const{productId,quantity=1} = req.body;

  if(!userId || !productId){
        return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
  }

  const product = await Product.findOne({
    _id:productId,
    isActive:true
  })
    if (!product)
      return res
        .status(404)
        .json({ success: false, msg: "Product unavailable" });

        let cart = await Cart.findOne({
          user:userId
        })

        if(!cart){
          cart= new Cart({
            user:userId,
            items:[
              {product:productId, quantity:parseInt(quantity)}
            ]
          })
        }else{
          const itemIndex= cart.items.findIndex(
            (item)=>item.product.toString() === productId
          );
          if(itemIndex > -1){
            cart.items[itemIndex].quantity += parseInt(quantity)
          }else{
            cart.items.push({
              product:productId,quantity:parseInt(quantity)
            })
          }

        }

        await cart.save();
        res.status(201).json({
          success:true,
          message:"Product added to cart "
        })

      
        

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

const getCart= async(req,res)=>{
  try{
  const userId = req.userId;

  const cart = await Cart.findOne({
    user:userId
  }).populate("items.product","title price discount images quantity isActive");

  if(!cart){
        return res.json({ success: true, items: [], cartTotal: 0 });
  }

  const validItems= cart.items.filter((item)=>item.product && item.product.isActive);

  if(validItems.length !== cart.items.length){
    await Cart.updateOne({
      _id:cart.id
    },
    {
      $set:{
        items:validItems.map((i)=>({
          product:i.product._id,
              quantity: i.quantity,
        }))
      }
    }
  )
  }
      let total = 0;
    let finalItems = validItems.map((item) => {
      const priceToUse =
        item.product.discount > 0
          ? item.product.price -
            item.product.price * (item.product.discount / 100)
          : item.product.price;

      total += priceToUse * item.quantity;

    return {
  productId: item.product._id,
  title: item.product.title,
  image:
  Array.isArray(item.product.images) &&
  item.product.images.length > 0
    ? item.product.images[0]
    : "",
  price: item.product.price,
  discount: item.product.discount || 0,
  finalPrice: priceToUse,
  stock: item.product.quantity || 0,
  cartQuantity: item.quantity,
};
    });

    res.json({ success: true, items: finalItems, cartTotal: total });

  }catch(err){
      res.status(500).json({
      success:false,
      message:err.message
  })
}
}

const updateCart=async(req,res)=>{
  try{
  const userId= req.userId
 const{productId,action} = req.body;

 const cart =await  Cart.findOne({
  user:userId
 })

 if (!cart) {
    return res.status(404).json({
        success:false,
        message:"Cart not found"
    });
}

 const itemIndex= cart.items.findIndex((item)=>item.product.toString()=== productId);

   if(action === "increment"){
    cart.items[itemIndex].quantity +=1;
   }else if(action === "decrement"){
    cart.items[itemIndex].quantity -=1;
    if(cart.items[itemIndex].quantity <=0){
      cart.items.splice(itemIndex,1)
    }
   }else{
    return res.status(400).json({
      success:false
,
message:"Invalid action type" })
   }
  await cart.save();

  res.status(200).json({
    success:true,
    message:"cart updated"
  })
  }catch(err){
      res.status(500).json({
      success:false,
      message:err.message
  })
  }



}

const removeFromCart= async(req,res)=>{
  try{
  const userId= req.userId;
  const{productId} = req.body;

  const cart = await Cart.findOne({
    user:userId
  })

  if(!cart){
    return res.status(400).json({
      success:false,
      message:"cart not found"
    })
  }

  cart.items= cart.items.filter((item)=>item.product.toString() !== productId);

  await cart.save();

  res.status(200).json({
    success:true,
    message:"Item removed from cart"
  })


  }catch(err){
        res.status(500).json({
      success:false,
      message:err.message  })
  }




}

const adminGetAllCarts = async (req, res) => {
  try {

    const carts = await Cart.find({})
      .populate("user", "firstName lastName email phoneNumber")
      .populate("items.product", "title price discount image quantity");

    res.status(200).json({
      success: true,
      count: carts.length,
      carts,
    });

  } catch (err) {

    console.log(err);   // <-- ADD THIS

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports={addToCart,getCart, updateCart,removeFromCart,adminGetAllCarts,clearCart}