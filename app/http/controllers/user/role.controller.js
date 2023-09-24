const Controller = require("../controller");
const { roleModel } = require("../../../models/role.model");
const createError = require("http-errors");
const { ObjectId } = require("mongodb");

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
  async editRole(req, res, next) {
    try {
      const data = req.body;
      const { id: _id } = req.params;
      if (Object.keys(data).length === 0) {
        return next(createError.BadRequest("you cannot send empty data"));
      }
      const validItems = ["title", "permissions"];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          return next(createError.BadRequest("bad item sent for " + key));
        }
        if (!data[key] || data[key].length === 0) {
          return next(createError.BadRequest("bad value sent for " + key));
        }
      });
      const permissions = await roleModel.findById(_id, {
        permissions: 1,
      });
      if (!permissions) {
        return next(
          createError.InternalServerError("fetching permissions data failed")
        );
      }
      for (let permission of permissions.permissions) {
        if (
          typeof data.permissions === "string" &&
          new ObjectId(data.permissions).equals(permission)
        ) {
          return next(createError.Conflict("permission already exists"));
        } else if (typeof data.permissions === "object") {
          for (let item of data.permissions) {
            if (new ObjectId(item).equals(permission)) {
              return next(createError.Conflict("permission already exists"));
            }
          }
        }
      }
      const query = {
        $push: { permissions: data.permissions },
      };
      data.title && (query["$set"] = { title: data.title });
      const update = await roleModel.updateOne({ _id }, query);
      if (update.modifiedCount === 0) {
        return next(createError.InternalServerError("updating role failed"));
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new RoleConroller();
