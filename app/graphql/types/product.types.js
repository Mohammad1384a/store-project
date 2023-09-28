const {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
} = require("graphql");
const { authorType } = require("./public.types");

const commentsType = new GraphQLObjectType({
  name: "commentstype",
  fields: {
    user: { type: GraphQLString },
    comment: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    parent: { type: GraphQLString },
  },
});
const featuresType = new GraphQLObjectType({
  name: "featuresType",
  fields: {
    length: { type: GraphQLInt },
    height: { type: GraphQLInt },
    width: { type: GraphQLInt },
    weight: { type: GraphQLInt },
    colors: { type: new GraphQLList(GraphQLString) },
    model: { type: GraphQLString },
    made_in: { type: GraphQLString },
  },
});
const productType = new GraphQLObjectType({
  name: "productType",
  fields: {
    title: { type: GraphQLString },
    brief_text: { type: GraphQLString },
    body: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    categories: { type: new GraphQLList(GraphQLString) },
    comments: { type: new GraphQLList(commentsType) },
    likes: { type: new GraphQLList(GraphQLString) },
    dislikes: { type: new GraphQLList(GraphQLString) },
    bookmarks: { type: new GraphQLList(GraphQLString) },
    price: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    quentity: { type: GraphQLInt },
    type: { type: GraphQLString }, // virtual,physical
    format: { type: GraphQLString },
    vendor: { type: authorType },
    features: { type: featuresType },
  },
});

module.exports = {
  productType,
};
