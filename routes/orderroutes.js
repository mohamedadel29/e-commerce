const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  findSpecifcOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderservices");

const authservices = require("../services/authservices");


const router = express.Router();
router.use(authservices.protect);

router.get('/checkout-session/:cartId',authservices.allowedto('user'),checkoutSession)

router.route("/:cartId").post(createCashOrder);
  router.get('/:id',findSpecifcOrder);
  router.get("/",authservices.allowedto('user', 'admin', 'manager'),filterOrderForLoggedUser,findAllOrders );

  router.put('/:id/pay', authservices.allowedto('admin', 'manager'),updateOrderToPaid);

  router.put('/:id/deliver', authservices.allowedto('admin', 'manager'),updateOrderToDelivered);


module.exports = router;
