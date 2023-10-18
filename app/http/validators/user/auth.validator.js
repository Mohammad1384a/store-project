const { body } = require("express-validator");

function authValidator() {
  return [
    body("phone")
      .isMobilePhone("fa-IR")
      .withMessage("Please enter a valid mobile phone"),
    body("code")
      .optional()
      .isString()
      .isLength({ min: 5, max: 5 })
      .withMessage("code must be 5 characters"),
  ];
}

module.exports = {
  authValidator,
};
