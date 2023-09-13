const Controller = require("../controller");
const { courseModel } = require("../../../models/course.model");
const createError = require("http-errors");
const { ObjectId } = require("mongodb");

class ChapterController extends Controller {
  async addChapter(req, res, next) {
    try {
      const { chapters } = req.body;
      const { id } = req.params;
      const chapter = await courseModel.updateOne(
        { _id: id },
        { $push: { chapters } }
      );
      if (chapter.modifiedCount === 0) {
        throw createError.InternalServerError("adding chapter failed");
      }
      return res.status(200).json({
        status: 200,
        chapter,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async getCourseChapters(req, res, next) {
    try {
      const { id: _id } = req.params;
      const course = await courseModel.findOne(
        { _id },
        { chapters: 1, _id: 0, title: 1 }
      );
      if (!course) {
        throw createError.NotFound("not found course");
      }
      return res.status(200).json({
        status: 200,
        course,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async removeChapter(req, res, next) {
    try {
      const { id: chapterId } = req.params;
      const remove = await courseModel.updateOne(
        { "chapters._id": chapterId },
        { $pull: { chapters: { _id: new ObjectId(chapterId) } } }
      );
      if (remove.modifiedCount === 0) {
        throw createError.InternalServerError("deleting chapter failed");
      }
      return res.status(200).json({
        status: 200,
        remove,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async editChapter(req, res, next) {
    try {
      const { id: chapterId } = req.params;
      const data = req.body;
      if (Object.keys(data).length === 0) {
        throw createError.BadRequest("invalid data sent");
      }
      const validItems = ["title", "body"];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          throw createError.BadRequest("invalid item send");
        }
        if (!data[key] || data[key].length === 0) {
          throw createError.BadRequest("invalid value sent");
        }
        data[key].trim();
      });
      const update = await courseModel.updateOne(
        { "chapters._id": chapterId },
        data.title && data.body
          ? { $set: { "chapters.$": data } }
          : data.title && !data.body
          ? { $set: { "chapters.$.title": data.title } }
          : { $set: { "chapters.$.body": data.body } }
      );
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new ChapterController();
