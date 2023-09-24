const { permissionModel } = require("../../../models/role.model");
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

  async addPermission(req, res, next) {
    try {
      const { title } = req.body;
      const description = req.body.description ?? "";
      const permission = await permissionModel.create({ title, description });
      if (!description) {
        return next(
          createError.InternalServerError("creating permission failed")
        );
      }
      return res.status(200).json({
        status: 200,
        permission,
      });
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
