const express = require("express");

const authService = require("../services/authservices");

const { addproductTowishlist,removeProductFromWishlist,getLoggedUserWishlist } = require("../services/wishlistservices");

const router = express.Router();

router.use(authService.protect, authService.allowedto("user"));

router.route('/').post(addproductTowishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;
