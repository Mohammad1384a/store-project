const Controller = require("../controller");
const createError = require("http-errors");

class UserController extends Controller {
  async getUserList(req, res, next) {
    try {
      if (!req.file) {
        next(createError.BadRequest("bad request"));
      }
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new UserController();
