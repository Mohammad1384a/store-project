const { blogModel } = require("../models/blog.model");

async function checkExistence(model, id) {
  switch (model) {
    case "blogModel":
      return blogModel.findById(id);
  }
}

module.exports = {
  checkExistence,
};
