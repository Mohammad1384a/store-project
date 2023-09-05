const { body, param } = require("express-validator");

function blogValidator() {
  return [
    body("author").isMongoId().withMessage("please enter a valid mongoId"),
    body("title")
      .isLength({ min: 12, max: 35 })
      .withMessage("title should be between 12 and 35 characters"),
    body("brief_text")
      .isLength({ min: 10, max: 35 })
      .withMessage("brief text should be between 10 and 25 characters"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("tags should be an array of strings"),
    body("categories")
      .isArray({ min: 1, max: 5 })
      .withMessage("you should choose 2-5 categories"),
  ];
}

function updateBlogValidator() {
  return [
    body("title")
      .optional()
      .isLength({ min: 12, max: 35 })
      .withMessage("title should be between 12 and 35 characters"),
    body("brief_text")
      .optional()
      .isLength({ min: 10, max: 35 })
      .withMessage("brief text should be between 10 and 25 characters"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("tags should be an array of strings"),
    body("categories")
      .optional()
      .isArray({ min: 1, max: 5 })
      .withMessage("you should choose 2-5 categories"),
  ];
}

function validateId() {
  return [param("id").isMongoId().withMessage("please enter a valid mongoId")];
}

module.exports = { blogValidator, validateId, updateBlogValidator };
