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

module.exports = {
  chapterValidator,
};
