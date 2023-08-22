const express = require("express");
const { getALLUser,getUser,createUser,updateUser,deleteUser,uploadCategoryImage,resizeImage,changeuserpassword, getloggedUserData } = require("../services/userservices");
const { createUserValidator,updateUserValidator,getUserValidator,deleteUserValidator,changeUserPasswordValidator } = require("../util/validator/userValidator");
const authservices=require("../services/authservices")
const router = express.Router();

router.use(authservices.protect,authservices.allowedto('admin'));
router.post("/", uploadCategoryImage,resizeImage,createUserValidator,createUser);
router.get("/", getALLUser);
router.get("/:id",getUserValidator, getUser);
router.put("/update/:id",uploadCategoryImage,resizeImage,updateUserValidator,updateUser);
router.delete("/delete/:id",deleteUserValidator, deleteUser);
router.put("/changepassword/:id",changeUserPasswordValidator,changeuserpassword);
router.get("/getme",authservices.protect,getloggedUserData)
module.exports = router;