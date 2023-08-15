const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { userModel } = require("../../models/user.model");

function isUserLoggedIn(req, res, next) {
  try {
    const headers = req.headers;
    const [bearer, token] = headers.authorization?.split(" ");
    if (!token || !bearer || bearer.toLowerCase() !== "bearer") {
      throw createError.BadRequest("please enter a valid token");
    }
    return jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
      if (err) {
        throw createError.Unauthorized(err?.message ?? err);
      }
      const { payload: phone } = payload;
      console.log(payload);
      const user = await userModel.findOne({ phone }, { password: 0, otp: 0 });
      if (!user) {
        throw createError.Unauthorized("not found user");
      }
      req.user = user;
      return next();
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  isUserLoggedIn,
};
