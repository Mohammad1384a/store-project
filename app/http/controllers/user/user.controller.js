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
      const { id: userId } = req.params;
      const data = req.body;
      const validItems = [
        "first_name",
        "last_name",
        "username",
        "birthday",
        "email",
      ];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          return next(createError.BadRequest("invalid key sent in " + key));
        }
        if (!data[key] || data[key].length === 0) {
          return next(createError.BadRequest("bad value sent for " + key));
        }
      });
      const update = await userModel.updateOne({ _id: userId }, { $set: data });
      if (update.modifiedCount === 0) {
        return next(createError.InternalServerError("updating user failed"));
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async getUserById(req, res, next) {
    try {
      const { id: userId } = req.params;
      const user = await userModel.findById(userId);
      if (!user) {
        return next(createError.NotFound("not found user"));
      }
      return res.status(200).json({
        status: 200,
        user,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new UserController();
