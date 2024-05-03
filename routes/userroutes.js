const express = require("express");
const { getALLUser,getUser,createUser,updateUser,deleteUser,uploadCategoryImage,resizeImage,changeuserpassword, getloggedUserData, updateLoggedUserPassword, deleteLoggedUserData, updateLoggedUserData } = require("../services/userservices");
const { createUserValidator,updateUserValidator,getUserValidator,deleteUserValidator,changeUserPasswordValidator, updateLoggedUserValidator } = require("../util/validator/userValidator");
const authservices=require("../services/authservices")
const router = express.Router();

router.use(authservices.protect);
router.get("/getme",getloggedUserData,getUser)
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

//admin
router.use(authservices.allowedto('admin', 'manager'));
router.post("/", uploadCategoryImage,resizeImage,createUserValidator,createUser);
router.get("/", getALLUser);
router.get("/:id",getUserValidator, getUser);
router.put("/update/:id",uploadCategoryImage,resizeImage,updateUserValidator,updateUser);
router.delete("/delete/:id",deleteUserValidator, deleteUser);
router.put("/changepassword/:id",changeUserPasswordValidator,changeuserpassword);
module.exports = router;