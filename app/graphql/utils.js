const { blogModel } = require("../models/blog.model");
const { productModel } = require("../models/product.model");
const { courseModel } = require("../models/course.model");

async function checkExistence(model, id) {
  switch (model) {
    case "blog":
      return blogModel.findById(id);
    case "course":
      return courseModel.findById(id);
    case "product":
      return productModel.findById(id);
  }
}

function returnUpdate(model, id, data) {
  switch (model) {
    case "blog": {
      return blogModel.updateOne({ _id: id }, { $push: { comments: data } });
    }
    case "blogParent": {
      return blogModel.updateOne(
        { "comments._id": id },
        { $push: { "comments.$.replies": data } }
      );
    }
    case "course": {
      return courseModel.updateOne({ _id: id }, { $push: { comments: data } });
    }
    case "courseParent": {
      return courseModel.updateOne(
        { "comments._id": id },
        { $push: { "comments.$.replies": data } }
      );
    }
    case "product": {
      return productModel.updateOne({ _id: id }, { $push: { comments: data } });
    }
    case "productParent": {
      return productModel.updateOne(
        { "comments._id": id },
        { $push: { "comments.$.replies": data } }
      );
    }
  }
}

function like(model, id, user, likeExists) {
  switch (model) {
    case "blog": {
      return blogModel.updateOne(
        { _id: id },
        likeExists
          ? { $pull: { likes: user._id } }
          : { $push: { likes: user._id } }
      );
    }
    case "course": {
      return courseModel.updateOne(
        { _id: id },
        likeExists
          ? { $pull: { likes: user._id } }
          : { $push: { likes: user._id } }
      );
    }
    case "product": {
      return productModel.updateOne(
        { _id: id },
        likeExists
          ? { $pull: { likes: user._id } }
          : { $push: { likes: user._id } }
      );
    }
  }
}

module.exports = {
  checkExistence,
  returnUpdate,
  like,
};
