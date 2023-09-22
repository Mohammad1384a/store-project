const { body } = require("express-validator");

function roleValidator() {
  return [
    body("title")
      .isString()
      .isLength({ min: 3, max: 10 })
      .withMessage("title must be between 3-10 characters"),
    body("permissions")
      .optional()
      .isMongoId()
      .withMessage("please entery valid mongoIds")
      .isArray({ min: 1, max: 5 })
      .withMessage("permissions must be between 1-5 ids"),
  ];
}

module.exports = {
  roleValidator,
};
