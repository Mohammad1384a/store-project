const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { bookmarkMutation } = require("./mutations/bookmark.mutation");
const { likeMutation } = require("./mutations/like.mutation");
const { blogResolver } = require("./resolvers/blog.resolver");
const { addComment } = require("./mutations/comment.mutation");
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
    addCourseComment: addComment,
    addProductComment: addComment,
    likeBlog: likeMutation,
    likeCourse: likeMutation,
    likeProduct: likeMutation,
    bookmarkBlog: bookmarkMutation,
    bookmarkCourse: bookmarkMutation,
    bookmarkProduct: bookmarkMutation,
  },
});

const graphql_schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = { graphql_schema };
