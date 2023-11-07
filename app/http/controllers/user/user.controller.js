const Controller = require("../controller");
const { userModel } = require("../../../models/user.model");
const createError = require("http-errors");

class UserController extends Controller {
  async getUserList(req, res, next) {
    try {
      const { search } = req.query;
      const users = await userModel.find({}, { __v: 0, _id: 0 });
      if (users.length === 0) {
        return next(createError.NotFound("no users found"));
      }
      const filterItems = [
        "first_name",
        "last_name",
        "phone",
        "email",
        "username",
      ];
      const filter = search
        ? users.filter((user) => {
            for (let item in user) {
              if (filterItems?.includes(item) && user[item]?.includes(search)) {
                return user;
              }
            }
          })
        : null;
      return res.status(200).json({
        status: 200,
        users: filter ?? users,
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
        "password",
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
      if (!update.modifiedCount) {
        return next(createError.InternalServerError("updating user failed"));
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(
          createError.BadRequest(
            "Phone number or username are already chosen try another one"
          )
        );
      }
      return next(createError.InternalServerError(error.message ?? error));
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
