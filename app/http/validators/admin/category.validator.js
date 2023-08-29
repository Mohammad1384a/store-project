const { body, param } = require("express-validator");

function categoryValidator() {
  return [
    body("title")
      .isLength({ min: 3, max: 30 })
      .withMessage("title must contain 3 to 30 characters"),
    body("parent")
      .optional()
      .isMongoId()
      .withMessage("please enter a valid mongo id"),
    param("parent")
      .optional()
      .isMongoId()
      .withMessage("please enter a valid mongo Id in params"),
    param("id")
      .optional()
      .isMongoId()
      .withMessage("please enter a valid mongo Id in params"),
  ];
}

module.exports = {
  categoryValidator,
};
