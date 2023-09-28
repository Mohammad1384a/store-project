const { GraphQLObjectType, GraphQLString } = require("graphql");

const categoriesTypes = new GraphQLObjectType({
  name: "categoriesTypes",
  fields: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});

module.exports = {
  categoriesTypes,
};
