const express = require("express");
const { createbrand, getALLbrand, getbrand, updatebrand, deletebrand,uploadCategoryImage,resizeImage, } = require("../services/brandservices");
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../util/validator/brandValidator");
const authService = require('../services/authservices');

const router = express.Router();
router.use(authService.protect);

router.post("/", uploadCategoryImage,resizeImage,createBrandValidator, createbrand);
router.get("/", getALLbrand);
router.get("/:id", getBrandValidator, getbrand);
router.put("/update/:id", authService.allowedto('admin','manager'),updateBrandValidator, updatebrand);
router.delete("/delete/:id", authService.allowedto('admin'),deleteBrandValidator, deletebrand);

module.exports = router;