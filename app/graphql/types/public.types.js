const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLScalarType,
} = require("graphql");
const { parseLiteral, toObject } = require("../../utils/parse");

const authorType = new GraphQLObjectType({
  name: "authorType",
  fields: {
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    last_name: { type: GraphQLString },
    first_name: { type: GraphQLString },
  },
});

const anyType = new GraphQLScalarType({
  name: "anyType",
  parseValue: toObject,
  serialize: toObject,
  parseLiteral: parseLiteral,
});

const publicCategoryType = new GraphQLList(
  new GraphQLObjectType({
    name: "publicCategoryType",
    fields: {
      _id: { type: GraphQLString },
      title: { type: GraphQLString },
    },
  })
);

const responseType = new GraphQLObjectType({
  name: "responseType",
  fields: {
    status: { type: GraphQLInt },
    data: { type: anyType },
  },
});

module.exports = {
  authorType,
  responseType,
  publicCategoryType,
  anyType,
};
