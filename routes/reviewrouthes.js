const express = require("express");
const {
  createreview,
  getALLreview,
  getreview,
  updatereview,
  deletereview,
  createFilterObj,
  setproductIdToBody,
} = require("../services/reviewservices");

const authservices = require("../services/authservices");
const {
  createReviewValidator,
  getreviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../util/validator/reviewValidation");

const router = express.Router({ mergeParams: true });

router.use(authservices.protect);
router.post("/",authservices.allowedto('user'),setproductIdToBody, createReviewValidator, createreview);
router.get("/", createFilterObj, getALLreview);
router.get("/:id", getreviewValidator, getreview);
router.put("/update/:id",authservices.allowedto('user'), updateReviewValidator, updatereview);
router.delete("/:id",authservices.allowedto('user','manager','admin'), deleteReviewValidator, deletereview);

module.exports = router;
