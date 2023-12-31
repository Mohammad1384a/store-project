const { body, param } = require("express-validator");
const createError = require("http-errors");

function productValidator() {
  return [
    body("title")
      .isString()
      .isLength({ min: 15, max: 35 })
      .withMessage("title must contain 15-35 characters"),
    body("brief_text")
      .isString()
      .isLength({ min: 20, max: 150 })
      .withMessage("brief_text must contain 20-150 characters"),
    body("body")
      .isString()
      .isLength({ min: 50, max: 80 })
      .withMessage("you should introduce your product with 50-80 characters"),
    body("tags")
      .optional()
      .isArray({ min: 1, max: 5 })
      .withMessage("you should choose 1-5 tags"),
    body("categories")
      .isArray({ min: 1, max: 5 })
      .withMessage("you must choose 1-5 categories for your product"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("price should be a number"),
    body("discount")
      .optional()
      .isDecimal()
      .withMessage("discount should be a number"),
    body("quantity")
      .optional()
      .isDecimal()
      .withMessage("quantity should be a number"),
    body("type").custom((value) => {
      if (value === "physical" || value === "virtual") {
        return value;
      } else {
        throw new Error("type must physical or virtual");
      }
    }),
    body("features")
      .optional()
      .isObject()
      .withMessage("features should an object"),
  ];
}

function updateProductValidator() {
  return [
    body("title")
      .optional()
      .isString()
      .isLength({ min: 15, max: 35 })
      .withMessage("title must contain 15-35 characters"),
    body("brief_text")
      .optional()
      .isString()
      .isLength({ min: 20, max: 150 })
      .withMessage("brief_text must contain 20-150 characters"),
    body("body")
      .optional()
      .isString()
      .isLength({ min: 50, max: 80 })
      .withMessage("you should introduce your product with 50-80 characters"),
    body("tags")
      .optional()
      .isArray({ min: 1, max: 5 })
      .withMessage("you should choose 1-5 tags"),
    body("categories")
      .optional()
      .isArray({ min: 1, max: 5 })
      .withMessage("you must choose 1-5 categories for your product"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("price should be a number"),
    body("discount")
      .optional()
      .isDecimal()
      .withMessage("discount should be a number"),
    body("quantity")
      .optional()
      .isDecimal()
      .withMessage("quantity should be a number"),
    body("type")
      .optional()
      .equals("physical" || "virtual")
      .withMessage("type should be physical or virtual"),
    body("features")
      .optional()
      .isObject()
      .withMessage("features should an object"),
  ];
}

function validateId() {
  return [
    param("id").isMongoId().withMessage("please enter a valid mongoId"),
    param("courseId")
      .optional()
      .isMongoId()
      .withMessage("please enter a valid courseid"),
  ];
}

module.exports = {
  productValidator,
  validateId,
  updateProductValidator,
};
