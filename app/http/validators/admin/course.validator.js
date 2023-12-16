const { body } = require("express-validator");

function courseValidator() {
  return [
    body("title")
      .isString()
      .isLength({ min: 10, max: 25 })
      .withMessage("title must contain 10-25 characters"),
    body("brief_text")
      .isString()
      .isLength({ min: 20, max: 40 })
      .withMessage("brief_text must contain 20-40 characters"),
    body("description")
      .isString()
      .trim()
      .isLength({ min: 60, max: 150 })
      .withMessage("description must contain 60-150 characters"),
    body("tags")
      .optional()
      .isArray({ min: 1, max: 4 })
      .withMessage("you should choose 1-4 tags"),
    body("category")
      .isString()
      .withMessage("you should choose a category for your course"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("please choose a valid number for price"),
    body("discount")
      .optional()
      .isDecimal()
      .withMessage("please choose a valid number for discount"),
    body("status").custom((value) => {
      if (value === "ongoing" || value === "done" || value === "notStarted") {
        return value;
      } else {
        throw new Error("status must be ongoing,done or notstarted");
      }
    }),
    body("value").custom((value) => {
      if (value === "free" || value === "monetary" || value === "premium") {
        return value;
      } else {
        throw new Error("value must be free,monetary or premium");
      }
    }),
    body("teacher")
      .isMongoId()
      .withMessage("please enter a valid mongodId for teacher"),
  ];
}
function editCourseValidator() {
  return [
    body("title")
      .optional()
      .isString()
      .isLength({ min: 10, max: 25 })
      .withMessage("title must contain 10-25 characters"),
    body("brief_text")
      .optional()
      .isString()
      .isLength({ min: 20, max: 40 })
      .withMessage("brief_text must contain 20-40 characters"),
    body("description")
      .optional()
      .isString()
      .trim()
      .isLength({ min: 60, max: 150 })
      .withMessage("description must contain 60-150 characters"),
    body("tags")
      .optional()
      .isArray({ min: 1, max: 5 })
      .withMessage("you should choose 1-5 tags"),
    body("categories")
      .optional()
      .isMongoId()
      .isArray({ min: 1, max: 5 })
      .withMessage("you should choose 1-5 mongoIds for your categories"),
    body("price")
      .optional()
      .isDecimal()
      .withMessage("please choose a valid number for price"),
    body("discount")
      .optional()
      .isDecimal()
      .withMessage("please choose a valid number for discount"),
    body("status")
      .optional()
      .custom((value) => {
        if (value === "ongoing" || value === "done" || value === "notstarted") {
          return value;
        } else {
          throw new Error("status must be ongoing,done or notstarted");
        }
      }),
    body("value")
      .optional()
      .custom((value) => {
        if (value === "free" || value === "monetary" || value === "premium") {
          return value;
        } else {
          throw new Error("value must be free,monetary or premium");
        }
      }),
    body("teacher")
      .optional()
      .isMongoId()
      .withMessage("please enter a valid mongodId for teacher"),
  ];
}
module.exports = {
  courseValidator,
  editCourseValidator,
};
