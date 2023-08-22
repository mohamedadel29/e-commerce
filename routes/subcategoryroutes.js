const express =require("express")
const { createsubcategory, getAllsubcategory, getsubcategory, updatesubcategory, deletesubcategory,setCategoryIdToBody,createFilterObj } = require("../services/subcategoryservices")
const {createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator} = require("../util/validator/subcategoryValidator")
const authservices = require("../services/authservices");
//merge parems allow us to acess paremeter on ather router
const router = express.Router({ mergeParams: true });
router.use(authservices.protect);

router.post("/",authservices.allowedto('admin','manager'),setCategoryIdToBody,createSubCategoryValidator,createsubcategory)
router.get("/",createFilterObj,getAllsubcategory)
router.get("/:id",getSubCategoryValidator,getsubcategory)
router.put("/update/:id",authservices.allowedto('admin','manager'),pdateSubCategoryValidator,updatesubcategory)
router.delete("/delete/:id",authservices.allowedto('admin'),deleteSubCategoryValidator,deletesubcategory)

module.exports=router