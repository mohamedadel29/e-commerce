const express = require("express");
const { createcoupon,deletecoupon,getALLCoupon,getcoupon,updatecoupon } = require("../services/couponservices");
const authservices = require("../services/authservices");

const router = express.Router();
router.use(authservices.protect,authservices.allowedto('admin','manager'));

router.post("/",createcoupon  );
router.get("/", getALLCoupon);
router.get("/:id", getcoupon);
router.put("/:id",updatecoupon );
router.delete("/:id", deletecoupon);



module.exports = router;