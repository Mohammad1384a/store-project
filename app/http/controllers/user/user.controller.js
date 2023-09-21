const Controller = require("../controller");
const { userModel } = require("../../../models/user.model");
const createError = require("http-errors");

class UserController extends Controller {
  async getUserList(req, res, next) {
    try {
      const query = req.query.search;
      const users = await userModel.find(
        query ? { $text: { $search: query } } : {},
        { __v: 0, _id: 0 }
      );
      if (users.length === 0) {
        return next(createError.NotFound("no users found"));
      }
      return res.status(200).json({
        status: 200,
        users,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async editUser(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async getUserById(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new UserController();
