const { permissionModel } = require("../../../models/role.model");
const Controller = require("../controller");
const createError = require("http-errors");

class PermissionController extends Controller {
  async getPermissionList(req, res, next) {
    try {
      const permissions = await permissionModel.find({});
      if (!permissions) {
        return next(
          createError.InternalServerError("fetching permissions failed")
        );
      }
      if (permissions.length === 0) {
        return next(createError.NotFoundj("not permissions found"));
      }
      return res.status(200).json({
        status: 200,
        permissions,
      });
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
      const { id: _id } = req.params;
      const remove = await permissionModel.deleteOne({ _id });
      if (remove.deletedCount === 0) {
        return next(
          createError.InternalServerError("removing permission failed")
        );
      }
      return res.status(200).json({
        status: 200,
        remove,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new PermissionController();
