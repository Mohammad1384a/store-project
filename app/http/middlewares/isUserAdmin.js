const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { userModel } = require("../../models/user.model");

function isUserAdmin(req, res, next) {
  try {
    const headers = req.headers;
    const [bearer, token] = headers.authorization?.split(" ");
    if (!token || !bearer || bearer.toLowerCase() !== "bearer") {
      throw res.status(401).json({
        status: 401,
        message: "please enter a valid token",
      });
    }
    return jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
      if (err) {
        throw res.status(400).json({
          status: 400,
          message: err?.message ?? err,
        });
      }
      const { payload: phone } = payload;
      const user = await userModel.findOne({ phone }, { password: 0, otp: 0 });
      if (!user) {
        throw res.status(401).json({
          status: 401,
          message: "not found user",
        });
      }
      if (!user.roles.includes("ADMIN")) {
        throw res.status(401).json({
          status: 401,
          message: "user is not admin",
        });
      }
      req.user = user;
      return next();
    });
  } catch (error) {
    next(createError.InternalServerError(error.message ?? error));
  }
}

module.exports = {
  isUserAdmin,
};
