const Controller = require("../controller");
const createError = require("http-errors");
const { categoryModel } = require("../../../models/category.model");

class CategoryController extends Controller {
  async add(req, res, next) {
    try {
      const { title, parent } = req.body;
      const create = await categoryModel.create({ title, parent });
      if (!create) {
        return next(
          createError.InternalServerError("creating category failed")
        );
      }
      return res.status(200).json({
        status: 200,
        create,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async removeById(req, res, next) {
    try {
      const { id } = req.params;
      const remove = await categoryModel.deleteOne({ _id: id });
      if (!remove.deletedCount) {
        return next(
          createError.InternalServerError("deleting category failed")
        );
      }
      return res.status(200).json({
        status: 200,
        remove,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async edit(req, res, next) {
    try {
      const { title, parent } = req.body;
      const { id } = req.params;
      const updateParent = parent ?? undefined;
      let update;
      if (updateParent) {
        update = await categoryModel.updateOne(
          { _id: id },
          { $set: { title, parent } }
        );
      } else {
        update = await categoryModel.updateOne(
          { _id: id },
          { $set: { title }, $unset: { parent: 1 } }
        );
      }
      if (!update.modifiedCount) {
        return next(
          createError.InternalServerError("updating category failed")
        );
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getAllCategories(req, res, next) {
    try {
      const categories = await categoryModel.find({});
      if (categories.length === 0) {
        return next(createError.BadRequest("no gategories found"));
      }
      return res.status(200).json({
        status: 200,
        categories,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getbyId(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryModel.findById({ _id: id });
      if (!category) {
        return next(createError.BadRequest("not found category"));
      }
      return res.status(200).json({
        status: 200,
        category,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getParents(req, res, next) {
    try {
      const parents = await categoryModel.aggregate([
        {
          $match: {
            parent: {
              $exists: false,
            },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children",
          },
        },
        { $project: { __v: 0, "children.parent": 0, "children.__v": 0 } },
      ]);
      if (!parents || parents.length === 0) {
        return next(createError.NotFound("no parents found"));
      }
      return res.status(200).json({
        status: 200,
        parents,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getChildrensParent(req, res, next) {
    try {
      const { parent } = req.params;
      const children = await categoryModel.find({ parent });
      if (children.length === 0) {
        return next(createError.BadRequest("not parents found"));
      }
      return res.status(200).json({
        status: 200,
        children,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
}

module.exports = new CategoryController();
