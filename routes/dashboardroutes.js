const express = require("express");
const {totalrevenue, getNumberOfOrders, ispending, isdelivery, countOrdersByPaymentStatus, totalprofit}=require("../services/dashboardservices")
const authService = require('../services/authservices');

const router = express.Router();
router.use(authService.protect,authService.allowedto('admin'));

router.get("/", totalrevenue);
router.get("/numorder",getNumberOfOrders)
router.get("/ispending",ispending)
router.get("/isdelivery",isdelivery)
router.get("/status",countOrdersByPaymentStatus)
router.get("/profit",totalprofit)


module.exports = router;