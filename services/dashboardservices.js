const asyncHandler = require('express-async-handler');
const Product=require("../model/productmodel")
const Order=require("../model/ordermodel")
exports.totalrevenue=asyncHandler(async(req,res)=>{
    try {
        const totalRevenueResult = await Order.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$totalOrderPrice" }
            }
          }
        ]);
    
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    
        // Find all orders and project only the totalOrderPrice field
        const allOrders = await Order.find({}, 'totalOrderPrice');
    
        // Extract the totalOrderPrice values into an array
        const totalOrderPrices = allOrders.map(order => order.totalOrderPrice);
    
        res.status(200).json({
          status: 'success',
          data: {
            totalRevenue,
            totalOrderPrices
          }
        });
      } catch (err) {
        res.status(500).json({
          status: 'fail',
          message: err.message
        });
      }
})
exports.totalprofit=asyncHandler(async(req,res)=>{
  try {
      const totalProfitResult = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalprofit: { $sum: { $multiply: ["$sold", "$price"] } }
          }
        }
      ]);
  
      const totalProfit = totalProfitResult.length > 0 ? totalProfitResult[0].totalprofit : 0;
  
      // Find all orders and project only the totalOrderPrice field
      const allprofit = await Product.find({}, { sold: 1, price: 1 });
  
      // Extract the totalOrderPrice values into an array
      const totalProfitPrices = allprofit.map(profit => profit.sold*profit.price);
  
      res.status(200).json({
        status: 'success',
        data: {
          totalProfit,
          totalProfitPrices
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message
      });
    }
})
exports.getNumberOfOrders = async (req, res, next) => {
    try {
      const numOfOrders = await Order.countDocuments();
  
      res.status(200).json({
        status: 'success',
        data: {
          numOfOrders
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message
      });
    }
  };
  
  exports.ispending = async (req, res, next) => {
    try {
      const ispending = await Order.countDocuments({isPaid: false });
  
      res.status(200).json({
        status: 'success',
        data: {
            ispending
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message
      });
    }
  };

  exports.isdelivery = async (req, res, next) => {
    try {
      const isdelivery = await Order.countDocuments({isDelivered: true });
  
      res.status(200).json({
        status: 'success',
        data: {
            isdelivery
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message
      });
    }
  };

  exports.countOrdersByPaymentStatus = asyncHandler(async (req, res) => {
    try {
      const numPaidOrders = await Order.countDocuments({ isPaid: true });
      const numPendingOrders = await Order.countDocuments({ isPaid: false });
        const numDeliveredOrders = await Order.countDocuments({ isDelivered: true });
      res.status(200).json({
        status: 'success',
        data: {
          paidOrders: numPaidOrders,
          pendingOrders: numPendingOrders,
          onWay:numDeliveredOrders
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message
      });
    }
  });