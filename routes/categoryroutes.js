const express = require("express");
const multer  = require('multer')
const {
  createcategory,
  getALLcategory,
  getcategory,
  updatecategory,
  deletecategory,
  resizeImage,
  uploadCategoryImage,
} = require("../services/categoryservices");
const upload = multer({ dest: 'uploads/categories' })
const subcategoryroute = require("./subcategoryroutes");
const {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
} = require("../util/validator/categoryValidator");
const authservices=require("../services/authservices")
const router = express.Router();

router.use("/:Id/subcategory", subcategoryroute);

router.post("/",authservices.protect,authservices.allowedto('admin','manager'),uploadCategoryImage,resizeImage,createCategoryValidator, createcategory);
router.get("/", getALLcategory);
router.get("/:id", getCategoryValidator, getcategory);
router.put("/update/:id", authservices.allowedto('admin','manager'),uploadCategoryImage,resizeImage,updateCategoryValidator, updatecategory);
router.delete("/delete/:id", authservices.allowedto('admin'),deleteCategoryValidator, deletecategory);

module.exports = router;
