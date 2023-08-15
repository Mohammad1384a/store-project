const { body } = require("express-validator");

function authValidator() {
  return [
    body("phone")
      .isMobilePhone("fa-IR")
      .withMessage("Please enter a valid mobile phone"),
  ];
}

module.exports = {
  authValidator,
};
