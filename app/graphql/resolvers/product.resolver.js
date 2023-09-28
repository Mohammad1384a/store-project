const { productType } = require("../types/product.types");
const { productModel } = require("../../models/product.model");
const { GraphQLList } = require("graphql");

const productResolver = {
  type: new GraphQLList(productType),
  resolve: async () => {
    return await productModel.find({}).populate("vendor").exec();
  },
};

module.exports = {
  productResolver,
};
