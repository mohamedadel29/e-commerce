const express = require("express");
const { exportdb }=require("../util/exports")
const authservices = require("../services/authservices");

const router = express.Router();
router.use(authservices.protect,authservices.allowedto('admin','manager'));

router.get("/", exportdb);




module.exports = router;