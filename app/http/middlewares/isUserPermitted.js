const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { userModel } = require("../../models/user.model");

function isUserPermitted(validPermissions = []) {
  return async function (req, res, next) {
    if (validPermissions?.length === 0) {
      return next(createError.BadRequest("no permission sent for the route"));
    }
    try {
      const headers = req?.headers;
      const [bearer, token] = headers?.authorization?.split(" ");
      if (!token || !bearer || bearer.toLowerCase() !== "bearer") {
        throw createError.BadRequest("please enter a valid token");
      }
      return jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
          return next(createError.Unauthorized(err.message ?? err));
        }
        const { payload: phone } = payload;
        const user = await userModel.findOne(
          { phone },
          { password: 0, otp: 0 }
        );
        if (!user) {
          throw createError.Unauthorized("not found user");
        }
        req.user = user;
        if (user.roles?.includes("ADMIN")) return next();
        const inclusion = validPermissions?.find((permission) =>
          user.roles?.includes(permission)
        );
        return next(
          inclusion
            ? null
            : createError.Forbidden(
                "you are not allowed to access this address"
              )
        );
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  };
}

async function graphUserPermission(req) {
  try {
    const headers = req.headers;
    if (!headers.authorization) {
      throw createError.BadRequest("please sent a authorization token");
    }
    const [bearer, token] = headers?.authorization?.split(" ");
    if (!token || !bearer || bearer.toLowerCase() !== "bearer") {
      throw createError.BadRequest("please enter a valid token");
    }
    return jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
      if (err) {
        throw createError.Unauthorized(err.message ?? err);
      }
      const { payload: phone } = payload;
      const user = await userModel.findOne({ phone }, { password: 0, otp: 0 });
      if (!user) {
        throw createError.Unauthorized("not found user");
      }
      return user;
    });
  } catch (error) {
    throw createError.InternalServerError(error.message ?? error);
  }
}

module.exports = {
  isUserPermitted,
  graphUserPermission,
};
