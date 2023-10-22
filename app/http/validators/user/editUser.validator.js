const { body } = require("express-validator");

function editUserValidator() {
  return [
    body("first_name")
      .optional()
      .isString()
      .isLength({ min: 2, max: 20 })
      .withMessage("first name should be between 2-20 characters"),
    body("last_name")
      .optional()
      .isString()
      .isLength({ min: 2, max: 20 })
      .withMessage("last name should be between 2-20 characters"),
    body("username")
      .optional()
      .isString()
      .isLength({ min: 5, max: 30 })
      .withMessage("username should be between 5-30 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("please enter a valid email"),
    body("birthday")
      .optional()
      .isDate()
      .withMessage("please enter a valid date format"),
    body("password")
      .optional()
      .isString()
      .matches("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")
      .withMessage(
        "password must be at least eight characters, one letter and one number"
      ),
  ];
}

module.exports = {
  editUserValidator,
};
