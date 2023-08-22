const express = require("express");
const { createproduct, getALLproduct, getproduct, updateproduct, deleteproduct,uploadProductImages,resizeProductImage } = require("../services/productservice");
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require("../util/validator/productValidator");
const reviewroutes=require("./reviewrouthes")
const authservices = require("../services/authservices");
const router = express.Router();
router.use("/:Id/reviews", reviewroutes);
router.use(authservices.protect);

router.post("/",authservices.allowedto('admin','manager'),uploadProductImages,resizeProductImage,createProductValidator ,createproduct );
router.get("/",getALLproduct );
router.get("/:id",getProductValidator ,getproduct );
router.put("/update/:id",authservices.allowedto('admin','manager'),uploadProductImages,resizeProductImage,updateProductValidator , updateproduct);
router.delete("/delete/:id",authservices.allowedto('admin'),deleteProductValidator ,deleteproduct );

module.exports = router;