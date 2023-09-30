const { categoriesTypes } = require("../types/categories.types");
const { GraphQLList, GraphQLString } = require("graphql");
const { categoryModel } = require("../../models/category.model");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");

const categoriesResolver = {
  type: new GraphQLList(categoriesTypes),
  resolve: async (_, arg, { req, res }) => {
    await graphUserPermission(req);
    return await categoryModel.find({ parent: undefined });
  },
};

const categoriesChildrenResolver = {
  type: new GraphQLList(categoriesTypes),
  args: {
    parent: { type: GraphQLString },
  },
  resolve: async (_, arg, { req, res }) => {
    await graphUserPermission(req);
    const { parent } = args;
    return await categoryModel.find({ parent });
  },
};

module.exports = {
  categoriesChildrenResolver,
  categoriesResolver,
};
