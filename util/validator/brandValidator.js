const { check } = require("express-validator");
const slugify = require('slugify');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id"),
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long"),
  validatorMiddleware,
];
