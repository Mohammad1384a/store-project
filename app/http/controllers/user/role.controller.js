const Controller = require("../controller");
const { roleModel } = require("../../../models/role.model");
const createError = require("http-errors");

class RoleConroller extends Controller {
  async getRolesList(req, res, next) {
    try {
      const roles = await roleModel.find({});
      if (!roles) {
        return next(createError.InternalServerError("fetching roles failed"));
      }
      return res.status(200).json({
        status: 200,
        roles,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async addRole(req, res, next) {
    try {
      const { title } = req.body;
      const permissions = req.body.permissions ?? [];
      const role = await roleModel.create({
        title,
        permissions,
      });
      if (!role) {
        return next(createError.InternalServerError("creating role faile"));
      }
      return res.status(200).json({
        status: 200,
        role,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async removeRole(req, res, next) {
    try {
      const { id: _id } = req.params;
      const remove = await roleModel.deleteOne({ _id });
      if (remove.deletedCount === 0) {
        return next(createError.InternalServerError("removing role failed"));
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

module.exports = new RoleConroller();
