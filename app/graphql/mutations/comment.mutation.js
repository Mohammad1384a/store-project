const { checkExistence, returnUpdate } = require("../utils");
const createEror = require("http-errors");
const { responseType } = require("../types/public.types");
const { GraphQLString } = require("graphql");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");

const addComment = {
  type: responseType,
  args: {
    comment: { type: GraphQLString },
    Id: { type: GraphQLString },
    model: { type: GraphQLString },
    parent: { type: GraphQLString },
  },
  resolve: async (_, args, { req, res }) => {
    const user = await graphUserPermission(req);
    const { comment, Id, model, parent } = args;
    if (!model) {
      throw createEror.BadRequest("you should send a model for updating");
    }
    const existence = await checkExistence(model, Id);
    if (!existence) {
      throw createEror.NotFound("not found item");
    }
    const data = {
      comment,
      user: user._id,
    };
    const update = await (parent
      ? returnUpdate(`${model}Parent`, parent, data)
      : returnUpdate(model, Id, data));
    if (!update.modifiedCount) {
      throw createEror.InternalServerError("adding comment failed");
    }
    return {
      status: 200,
      data: update,
    };
  },
};

module.exports = {
  addComment,
};
