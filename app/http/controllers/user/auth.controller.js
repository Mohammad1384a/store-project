const Controller = require("../controller");
const { randomNumber, generateToken } = require("../../../utils/functions");
const { userModel } = require("../../../models/user.model");
const createError = require("http-errors");

class AuthController extends Controller {
  async getOTP(req, res, next) {
    try {
      const { phone } = req.body;
      const user = await this.userExists(phone);
      const code = randomNumber().toString();
      const otp = {
        code,
        expiresIn: new Date().getTime() + 120000,
      };
      if (!user) {
        const token = await generateToken(phone);
        const createUser = await userModel.create({ phone, otp, token });
        if (!createUser)
          throw createError.InternalServerError("creating User failed");
        return res.status(200).json({
          status: 200,
          createUser,
        });
      }
      const updateUser = await userModel.updateOne(
        { phone: phone },
        { $set: { otp } }
      );
      if (!updateUser.modifiedCount)
        throw createError.InternalServerError("sending otp failed");
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
      const user = await userModel.findOne({ phone: phone, "otp.code": code });
      if (!user) {
        throw createError.BadRequest("code or mobile phone is not valid");
      }
      const now = new Date().getTime();
      if (user.otp.expiresIn < now) {
        throw createError.Unauthorized("session expired");
      }
      return res.status(200).json({
        status: 200,
        user,
      });
    } catch (error) {
      next(createError.BadRequest(error));
    }
  }

  async userExists(phone) {
    const user = await userModel.findOne({ phone });
    return !!user;
  }
}

module.exports = new AuthController();
