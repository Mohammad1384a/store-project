const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { blogResolver } = require("./resolvers/blog.resolver");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    blogs: blogResolver,
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {},
});

const graphql_schema = new GraphQLSchema({
  query: RootQuery,
  //   mutation: RootMutation,
});

module.exports = { graphql_schema };
