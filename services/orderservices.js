const stripe=require('stripe')('sk_test_51NfWmvDLCoSByEEWTiaq9uMUUcttfnFG76MDVLkIymj6R4mjjdyyxYSDiQ15lwZl7Uj9KHF7NCRm6eL98Wnywi2Y00NAooFwmi')
const asyncHandler = require("express-async-handler");
const ApiError = require("../util/ApiErrors");
const ApiFeatures = require("../util/ApiFeature");
const Order = require("../model/ordermodel");
const Cart = require("../model/cartmodel");
const Product=require("../model/productmodel");
const { updateOne } = require("../model/usermodel");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice=0;
    const shippingPrice=0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Cart not found with id ${req.params.cartId}`, 404)
    );
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
    const totalOrderPrice= cartPrice+taxPrice+shippingPrice

    const order=await Order.create({
        user:req.user._id,
        cartItems:cart.cartItems,
        shippingAddress:req.body.shippingAddress,
        totalOrderPrice,
    })
    if(order){
    const bulkOption=cart.cartItems.map((item) =>({
        updateOne:{
            filter:{
                _id:item.product
            },
            update:{
                $inc: { quantity: -item.quantity, sold: +item.quantity }
            }
        }
    }))
    await Product.bulkWrite(bulkOption,{})
    await Cart.findByIdAndDelete(req.params.cartId);


    }
    res.status(201).json({ status: 'success', data: order });

});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
});

exports.findAllOrders=asyncHandler(async(req,res)=>{
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  // Build query
  const documentsCounts = await Order.countDocuments();
  const apiFeatures = new ApiFeatures(Order.find(filter), req.query)
    .paginate(documentsCounts)
    .filter()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
})



exports.findSpecifcOrder=asyncHandler(async(req,res,next)=>{
  const { id } = req.params;
  // 1) Build query
  let query = Order.findById(id);
  // if (populationOpt) {
  //   query = query.populate(populationOpt);
  // }

  // 2) Execute query
  const document = await query;

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ data: document });
})

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});


exports.checkoutSession=asyncHandler(async(req,res)=>{
   // app settings
   const taxPrice = 0;
   const shippingPrice = 0;
 
   // 1) Get cart depend on cartId
   const cart = await Cart.findById(req.params.cartId);
   if (!cart) {
     return next(
       new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
     );
   }
 
   // 2) Get order price depend on cart price "Check if coupon apply"
   const cartPrice = cart.totalPriceAfterDiscount
     ? cart.totalPriceAfterDiscount
     : cart.totalCartPrice;
 
   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
 
   // 3) Create stripe checkout session
   const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
          currency: 'egp',
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
   });
 
   // 4) send session to response
   res.status(200).json({ status: 'success', session });
})

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});