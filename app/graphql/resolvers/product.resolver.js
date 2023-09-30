const { productType } = require("../types/product.types");
const { productModel } = require("../../models/product.model");
const { GraphQLList } = require("graphql");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");

const productResolver = {
  type: new GraphQLList(productType),
  resolve: async (_, arg, { req, res }) => {
    await graphUserPermission(req);
    return await productModel.find({}).populate("vendor").exec();
  },
};

module.exports = {
  productResolver,
};
