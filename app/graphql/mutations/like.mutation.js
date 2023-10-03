const { checkExistence, like } = require("../utils");
const createEror = require("http-errors");
const { responseType } = require("../types/public.types");
const { GraphQLString } = require("graphql");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");

const likeMutation = {
  type: responseType,
  args: {
    Id: { type: GraphQLString },
    model: { type: GraphQLString },
  },
  resolve: async (_, args, { req, res }) => {
    const user = await graphUserPermission(req);
    const { Id, model } = args;
    if (!model) {
      throw createEror.BadRequest("you should send a model for updating");
    }
    const existence = await checkExistence(model, Id);
    if (!existence) {
      throw createEror.NotFound("not found item");
    }
    const likeExists = existence.likes?.find((like) => like.equals(user._id));
    const update = await like(model, Id, user, likeExists);
    if (!update.modifiedCount) {
      throw createEror.InternalServerError("updating like failed");
    }
    return {
      status: 200,
      data: update,
    };
  },
};

module.exports = {
  likeMutation,
};
