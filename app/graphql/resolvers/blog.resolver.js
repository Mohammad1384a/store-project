const { GraphQLList } = require("graphql");
const { blogModel } = require("../../models/blog.model");
const { blogType } = require("../types/blog.type");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");

const blogResolver = {
  type: new GraphQLList(blogType),
  resolve: async (_, arg, { req, res }) => {
    await graphUserPermission(req);
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
