const express = require("express");
const { exportUserDB }=require("../util/exports")
const authservices = require("../services/authservices");

const router = express.Router();
router.use(authservices.protect,authservices.allowedto('admin','manager','user'));

router.get("/", exportUserDB);




module.exports = router;