const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const authorType = new GraphQLObjectType({
  name: "authorType",
  fields: {
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    last_name: { type: GraphQLString },
    first_name: { type: GraphQLString },
  },
});

const categoriesType = new GraphQLList(
  new GraphQLObjectType({
    name: "categoriesType",
    fields: {
      _id: { type: GraphQLString },
      title: { type: GraphQLString },
    },
  })
);

module.exports = {
  authorType,
  categoriesType,
};
