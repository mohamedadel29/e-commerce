const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Review=require('../../model/reviewmodel')
exports.getreviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title")
    .notEmpty()
    .withMessage("review required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long"),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid review ID formate"),
  check("product").isMongoId().withMessage("Invalid review ID formate").custom((val,{req})=>
    Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error('You already created a review before')
            );
          }
        }
      )
  ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
    check('id')
      .isMongoId()
      .withMessage('Invalid Review id format')
      .custom((val, { req }) =>
        // Check review ownership before update
        Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error(`There is no review with id ${val}`));
          }
          console.log(review.user._id.toString() != req.user._id.toString());
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        })
      ),
    validatorMiddleware,
  ];

  exports.deleteReviewValidator = [
    check('id')
      .isMongoId()
      .withMessage('Invalid Review id format')
      .custom((val, { req }) => {
        // Check review ownership before update
        if (req.user.role == 'user') {
          return Review.findById(val).then((review) => {
            if (!review) {
              return Promise.reject(
                new Error(`There is no review with id ${val}`)
              );
            }         
            if (review.user._id.toString() !== req.user._id.toString()) {
              return Promise.reject(
                new Error(`Your are not allowed to perform this action`)
              );
            }
          });
        }
        return true;
      }),
    validatorMiddleware,
  ];
