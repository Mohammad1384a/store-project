const { categoriesTypes } = require("../types/categories.types");
const { GraphQLList, GraphQLString } = require("graphql");
const { categoryModel } = require("../../models/category.model");

const categoriesResolver = {
  type: new GraphQLList(categoriesTypes),
  resolve: async () => {
    return await categoryModel.find({ parent: undefined });
  },
};

const categoriesChildrenResolver = {
  type: new GraphQLList(categoriesTypes),
  args: {
    parent: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const { parent } = args;
    return await categoryModel.find({ parent });
  },
};

module.exports = {
  categoriesChildrenResolver,
  categoriesResolver,
};
