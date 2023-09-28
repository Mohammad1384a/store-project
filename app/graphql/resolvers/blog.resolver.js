const { GraphQLList } = require("graphql");
const { blogModel } = require("../../models/blog.model");
const { blogType } = require("../types/blog.type");

const blogResolver = {
  type: new GraphQLList(blogType),
  resolve: async () => {
    return await blogModel
      .find({})
      .populate("author")
      .populate("categories")
      .exec();
  },
};

module.exports = {
  blogResolver,
};
