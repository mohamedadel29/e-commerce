const express = require("express");
const { signup, login,forgetPassword, verifyPassResetCode, resetPassword } = require("../services/authservices");
const { signupValidator, loginValidator } = require("../util/validator/authValidation");


const router = express.Router();

router.post("/signup", signupValidator,signup);

router.post("/login", loginValidator,login);

router.post("/forgetPassword",forgetPassword);

router.post("/verifyRestCode",verifyPassResetCode);

router.put("/resetPassword",resetPassword);


module.exports = router;