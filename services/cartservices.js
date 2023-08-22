const asyncHandler=require("express-async-handler")
const ApiError=require("../util/ApiErrors")
const usermodel = require("../model/usermodel");
const Cart=require("../model/cartmodel")
const Coupon=require("../model/couponmodel")
const Product=require("../model/productmodel")

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
  };

exports.addProductToCart=asyncHandler(async(req,res,next)=>{
    const {productId,color}=req.body
    const product =await Product.findById(productId)
   //1) Get Cart for logged user
    let cart =await Cart.findOne({user:req.user._id})
    if(!cart){
        // create cart fot logged user with product
        cart=await Cart.create({
            user:req.user._id,
            cartItems:[{product:productId,color,price:product.price}]
        })
    }else{
         // product exist in cart, update product quantity
         const productIndex=cart.cartItems.findIndex(
            (item) => item.product.toString()===productId&&item.color===color
         )
         if(productIndex>-1){
            const cartItem=cart.cartItems[productIndex];
            cartItem.quantity+=1;
            cart.cartItems[productIndex]=cartItem
         } else{
             // product not exist in cart,  push product to cartItems array
            cart.cartItems.push({product:productId,color,price:product.price})


         }
         
    }
    calcTotalCartPrice(cart)
    await cart.save()

    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart,
      });
})


exports.getLoggedCart=asyncHandler(async(req,res,next)=>{
const cart=await Cart.findOne({user:req.user._id})
if (!cart){
    return(next(new ApiError(`there is not cart for this id ${req.user._id}`,404)))
}
res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
})

exports.clearcart=asyncHandler(async(req,res,next)=>{
    const cart =await Cart.findOneAndDelete({user:req.user._id})
    res.status(204).json({message:"deleted"});
})

exports.deleteSpesficItemInCart=asyncHandler(async(req,res,next)=>{
    const cart=await Cart.findOneAndUpdate({user:req.user._id},{ $pull:{cartItems:{_id:req.params.itemId}}},{new:true})
    calcTotalCartPrice(cart)
    cart.save()
    res.status(200).json({
        status:'success',
        message:`item deleted from cart`,
        data : cart
        })

})

exports.updateCartItemQuantity =asyncHandler(async(req,res,next)=>{
    const {quantity}=req.body
    const cart =await Cart.findOne({user:req.user._id})
    if(!cart){
        return(next(new ApiError(`there is cart in this id ${req.user._id}`),404))
    }else{
         const productIndex=cart.cartItems.findIndex(
            (item) => item._id.toString()===req.params.itemId
         )
         if(productIndex>-1){
            const cartItem=cart.cartItems[productIndex];
            cartItem.quantity=quantity;
            cart.cartItems[productIndex]=cartItem
         } else{
            return next(
                new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
              );

         }
         calcTotalCartPrice(cart)
         await cart.save()
     
         res.status(200).json({
             status: 'success',
             message: 'Product update to cart successfully',
             numOfCartItems: cart.cartItems.length,
             data: cart,
           });
}})

exports.applyCoupon=asyncHandler(async(req,res,next)=>{
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
})