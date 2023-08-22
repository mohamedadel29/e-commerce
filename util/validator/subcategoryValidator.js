const { check } = require("express-validator");
const slugify = require('slugify');
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long"),
  check("category")
    .notEmpty()
    .isMongoId()
    .withMessage("in valid category id")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  check("name")
    .notEmpty()
    .withMessage("Subcategory required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long"),
  check("category").isMongoId().withMessage("in valid category id"),
  validatorMiddleware,
];
