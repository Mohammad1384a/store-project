const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { authorType, publicCategoryType } = require("./public.types");

const blogType = new GraphQLObjectType({
  name: "blogsType",
  fields: {
    _id: { type: GraphQLString },
    author: { type: authorType },
    title: { type: GraphQLString },
    brief_text: { type: GraphQLString },
    image: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    categories: { type: publicCategoryType },
  },
});

module.exports = {
  blogType,
};
