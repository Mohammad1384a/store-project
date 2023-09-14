const { body } = require("express-validator");

function chapterValidator() {
  return [
    body("chapters").custom((value) => {
      if (value.length === 0) {
        throw new Error("you should send some data!");
      }
      const data = JSON.parse(JSON.stringify(value));
      const validItems = ["title", "body", "episodes"];
      for (let i = 0; i < data.length; i++) {
        const current = data[i];
        Object.keys(current).forEach((key) => {
          if (!validItems.includes(key)) {
            throw new Error("invalid item sent");
          }
          if (
            (!current[key] ||
              current[key].length === 0 ||
              typeof current[key] !== "string") &&
            key !== "episodes"
          ) {
            throw new Error("bad value sent");
          }
          if (key === "episodes" && current[key] instanceof Array === false) {
            throw new Error("bad value sent for episodes");
          }
        });
      }
      return value;
    }),
  ];
}

function episodeValidator() {
  return [
    body("title")
      .isString()
      .isLength({ min: 5, max: 20 })
      .withMessage("title must be 5-20 characters"),
    body("body")
      .isString()
      .isLength({ min: 15, max: 30 })
      .withMessage("body must be 15-30 characters"),
    body("value")
      .optional()
      .isString()
      .custom((value) => {
        const validValues = ["free", "locked", "unlocked"];
        if (!validValues.includes(value)) {
          throw new Error("value can only be free,locked or unlocked");
        }
        return value;
      }),
    body("time")
      .matches(/[0-9]{2}\:[0-9]{2}\:[0-9]{2}/i)
      .withMessage("time format must be 00:00:00"),
  ];
}

module.exports = {
  chapterValidator,
  episodeValidator,
};
