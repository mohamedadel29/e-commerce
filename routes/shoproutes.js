const express = require("express");
const {
  getShops,
  createShop,
  getShop,
  updateShop,
  deleteShop,
  uploadProductImages,
  resizeProductImages,
} = require("../services/shopservices");
const authService = require("../services/authservices");
const productsRoute = require("./productroute");

const router = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use("/:shopId/products", productsRoute);

router
  .route("/")
  .get(getShops)
  .post(
    authService.protect,
    authService.allowedto("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createShop
  );
router
  .route("/:id")
  .get( getShop)
  .put(
    authService.protect,
    authService.allowedto("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateShop
  )
  .delete(
    authService.protect,
    authService.allowedto("admin"),
    deleteShop
  );

module.exports = router;
