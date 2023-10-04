const { GraphQLString } = require("graphql");
const { productModel } = require("../../models/product.model");
const { courseModel } = require("../../models/course.model");
const createEror = require("http-errors");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");
const { responseType } = require("../types/public.types");
const { blogModel } = require("../../models/blog.model");

const getUserItems = {
  type: responseType,
  args: {
    type: { type: GraphQLString },
    path: { type: GraphQLString },
  },
  resolve: async (_, args, { req, res }) => {
    const user = await graphUserPermission(req);
    const { type, path } = args;
    const validTypes = ["bookmarks", "likes"];
    if (!validTypes.includes(type)) {
      throw createEror.BadRequest("type must be bookmarks or likes");
    }
    const query =
      type === "likes" ? { likes: user._id } : { bookmarks: user._id };
    switch (path) {
      case "courses": {
        const items = await courseModel.find(query, {
          _id: 1,
          title: 1,
          brief_text: 1,
          description: 1,
          teacher: 1,
          image: 1,
        });
        if (items.length === 0) {
          throw createEror.NotFound("no items found");
        }
        return {
          status: 200,
          data: items,
        };
      }
      case "products": {
        const items = await productModel.find(query, {
          _id: 1,
          title: 1,
          brief_text: 1,
          body: 1,
          images: 1,
          vendor: 1,
        });
        if (items.length === 0) {
          throw createEror.NotFound("no items found");
        }
        return {
          status: 200,
          data: items,
        };
      }
      case "blogs": {
        const items = await blogModel.find(query, {
          _id: 1,
          author: 1,
          title: 1,
          brief_text: 1,
          image: 1,
        });
        if (items.length === 0) {
          throw createEror.NotFound("no items found");
        }
        return {
          status: 200,
          data: items,
        };
      }
      default:
        throw createEror.BadRequest("path must be courses, products or blogs");
    }
  },
};

module.exports = {
  getUserItems,
};
