const { GraphQLString, GraphQLInt } = require("graphql");
const { userModel } = require("../../models/user.model");
const createEror = require("http-errors");
const { courseModel } = require("../../models/course.model");
const { productModel } = require("../../models/product.model");
const { responseType } = require("../types/public.types");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");
const { isValidObjectId } = require("mongoose");

const basketMutation = {
  type: responseType,
  args: {
    path: { type: GraphQLString },
    Id: { type: GraphQLString },
    quentity: { type: GraphQLInt },
  },
  resolve: async (_, args, { req, res }) => {
    const user = await graphUserPermission(req);
    const { path, Id } = args;
    if (!isValidObjectId(Id)) {
      throw createEror.BadRequest("invalid objectId sent");
    }
    switch (path) {
      case "course": {
        const course = await courseModel.findById(Id);
        if (!course) {
          throw createEror.NotFound("not found course");
        }
        const inclusion = user.basket?.courses?.find((c) =>
          c?.courseId?.equals(course._id)
        );
        if (inclusion) {
          throw createEror.BadRequest("you cannot have duplicated course");
        }
        const data = {
          courseId: course._id,
        };
        const updateBasket = await userModel.updateOne(
          { _id: user._id },
          {
            $push: { "basket.courses": data },
          }
        );
        if (!updateBasket.modifiedCount) {
          throw createEror.InternalServerError(
            "failed to add course to basket"
          );
        }
        return {
          status: 200,
          data: updateBasket,
        };
      }
      case "product": {
        const product = await productModel.findById(Id);
        if (!product) {
          throw createEror.NotFound("not found product");
        }
        const { quentity } = args;
        if (!quentity || 20 > quentity < 1) {
          throw createEror.BadRequest("quentity must be between 1-10");
        }
        const index = user.basket?.products?.findIndex((p) =>
          p.productId?.equals(product._id)
        );
        const productsLength = user.basket?.products?.[index]?.count;
        if (productsLength + quentity > 20 && index >= 0) {
          throw createEror.BadRequest(
            "you cannot have more than 20 of each product you already have " +
              productsLength
          );
        }
        const query = {};
        index >= 0
          ? (query["$inc"] = { "basket.products.$.count": quentity })
          : (query["$push"] = {
              "basket.products": { productId: product._id, count: quentity },
            });
        const updateBasket = await userModel.updateOne(
          query["$push"]
            ? { _id: user._id }
            : { "basket.products.productId": Id },
          query
        );
        if (!updateBasket.modifiedCount) {
          throw createEror.InternalServerError(
            "failed to add product to basket"
          );
        }
        return {
          status: 200,
          data: updateBasket,
        };
      }
      default:
        throw createEror.BadRequest("invalid path sent " + path);
    }
  },
};

module.exports = {
  basketMutation,
};
