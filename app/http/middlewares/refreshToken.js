const createError = require("http-errors");
const { userModel } = require("../../models/user.model");
const { getRedis } = require("../../utils/functions");
const jwt = require("jsonwebtoken");

async function verifyRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      async (err, payload) => {
        if (err) {
          throw createError.Unauthorized(err?.message ?? err);
        }
        const { payload: phone } = payload;
        const user = await userModel.findOne({ phone });
        if (!user) {
          throw createError.BadRequest("no user found");
        }
        const userId = user._id.toString();
        const validToken = await getRedis(userId);
        if (validToken !== refreshToken) {
          throw createError.BadRequest("invalid token");
        }
        return next();
      }
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyRefreshToken,
};
