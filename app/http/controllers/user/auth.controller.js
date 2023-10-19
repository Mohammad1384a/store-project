const Controller = require("../controller");
const {
  randomNumber,
  generateToken,
  generateRefreshToken,
} = require("../../../utils/functions");
const { userModel } = require("../../../models/user.model");
const createError = require("http-errors");
class AuthController extends Controller {
  async getOTP(req, res, next) {
    try {
      const { phone } = req.body;
      const user = await this.userExists(phone.toString());
      const code = randomNumber().toString();
      const otp = {
        code,
        expiresIn: new Date().getTime() + 120000,
      };
      const token = await generateToken(phone);
      if (!user) {
        const createUser = await userModel.create({
          phone,
          otp,
          username: code,
          token,
        });
        if (!createUser) {
          return next(createError.InternalServerError("creating User failed"));
        }
        return res.status(200).json({
          status: 200,
          createUser,
        });
      }
      const updateUser = await userModel.updateOne(
        { phone: phone },
        { $set: { otp, token } }
      );
      if (!updateUser.modifiedCount) {
        return next(createError.InternalServerError("sending otp failed"));
      }
      return res.status(200).json({
        status: 200,
        updateUser,
      });
    } catch (error) {
      next(createError.BadRequest(error.message ?? error));
    }
  }

  async validateOTP(req, res, next) {
    try {
      const { phone, code } = req.body;
      const user = await userModel.findOne({ phone, "otp.code": code });
      if (!user) {
        return next(
          createError.BadRequest("code or mobile phone is not valid")
        );
      }
      const now = new Date().getTime();
      if (user?.otp?.expiresIn < now) {
        return next(createError.Unauthorized("session expired"));
      }
      const userId = user?._id?.toString();
      const refreshToken = await generateRefreshToken(phone, userId);
      if (!refreshToken) {
        return next(
          createError.InternalServerError("creating refresh token failed")
        );
      }
      return res.status(200).json({
        status: 200,
        user,
        refreshToken,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { phone } = req.body;
      const user = await userModel.findOne({ phone });
      if (!user) {
        return next(createError.BadRequest("not found user"));
      }
      const userId = user._id.toString();
      const newToken = await generateRefreshToken(phone, userId);
      if (!newToken) {
        return next(
          createError.InternalServerError("generating refresh token failed")
        );
      }
      return res.status(200).json({
        status: 200,
        refreshToken: newToken,
        user,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }

  async userExists(phone) {
    const user = await userModel.findOne({ phone });
    return !!user;
  }
}

module.exports = new AuthController();
