const Controller = require("../controller");
const createError = require("http-errors");

class PermissionController extends Controller {
  async getPermissionList(req, res, next) {
    try {
      return res.send("hello");
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async removePermission(req, res, next) {
    try {
      return res.send("hello");
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new PermissionController();
