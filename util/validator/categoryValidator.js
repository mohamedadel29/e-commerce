const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
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

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long"),
  validatorMiddleware,
];
