const express = require("express");
const { addProductToCart, getLoggedCart, deleteSpesficItemInCart, clearcart, updateCartItemQuantity, applyCoupon } = require("../services/cartservices");
const authservices = require("../services/authservices");

const router = express.Router();
router.use(authservices.protect,authservices.allowedto('user'));

router.post("/", addProductToCart);
router.get("/",getLoggedCart)
router.delete("/:itemId",deleteSpesficItemInCart)
router.delete("/",clearcart)
router.put("/:itemId",updateCartItemQuantity)
router.put('/', applyCoupon);

module.exports = router;