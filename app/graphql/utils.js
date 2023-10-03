const { blogModel } = require("../models/blog.model");
const { courseModel } = require("../models/course.model");

async function checkExistence(model, id) {
  switch (model) {
    case "blog":
      return blogModel.findById(id);
    case "course":
      return courseModel.findById(id);
  }
}

module.exports = {
  checkExistence,
};
