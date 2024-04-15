const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  createFilterObj,
  setshopIdAndUserIdToBody,
  getproducttoBigData,
  getproductbycategory,
} = require("../services/productservice");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../util/validator/productValidator");
const authService = require("../services/authservices");
const reviewsRoute = require("./reviewrouthes");

const router = express.Router({ mergeParams: true });

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(createFilterObj, getProducts)
  .post(
    authService.protect,
    authService.allowedto("admin", "manager"),
    setshopIdAndUserIdToBody,
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedto("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedto("admin"),
    deleteProductValidator,
    deleteProduct
  );
router.get("/bigdata/:id", getproducttoBigData);
router.get("/category/:categoryid",authService.protect,authService.allowedto("user"),getproductbycategory);
module.exports = router;
