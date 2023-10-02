const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require("graphql");
const { authorType } = require("./public.types");

const parentCommentType = new GraphQLObjectType({
  name: "parentCommentType",
  fields: {
    user: { type: authorType },
    comment: { type: GraphQLString },
  },
});

const commentType = new GraphQLObjectType({
  name: "commentType",
  fields: {
    user: { type: authorType },
    comment: { type: GraphQLString },
    parent: { type: parentCommentType },
    show: { type: GraphQLBoolean },
    commentPermitted: { type: GraphQLBoolean },
  },
});

module.exports = {
  commentType,
};
