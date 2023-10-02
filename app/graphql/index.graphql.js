const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { blogResolver, addComment } = require("./resolvers/blog.resolver");
const {
  categoriesResolver,
  categoriesChildrenResolver,
} = require("./resolvers/categories.resolver");
const { productResolver } = require("./resolvers/product.resolver");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    blogs: blogResolver,
    categories: categoriesResolver,
    categoriesChildren: categoriesChildrenResolver,
    products: productResolver,
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    addBlogComment: addComment,
  },
});

const graphql_schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = { graphql_schema };
