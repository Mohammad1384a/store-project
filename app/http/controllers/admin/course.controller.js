const Controller = require("../controller");
const { courseModel } = require("../../../models/course.model");
const createError = require("http-errors");
const { ObjectId } = require("mongodb");

class CourseController extends Controller {
  async aggregateCourse(id) {
    try {
      const courses = await courseModel.aggregate([
        id ? { $match: { _id: new ObjectId(id) } } : { $match: {} },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "teacher",
            as: "teacher",
          },
        },
        { $unwind: "$teacher" },
        {
          $project: {
            "teacher.otp": 0,
            "teacher._id": 0,
            "teacher.bills": 0,
            "teacher.token": 0,
            "chapters._id": 0,
            "teacher.refreshToken": 0,
            "teacher.__v": 0,
            __v: 0,
            _id: 0,
          },
        },
        {
          $lookup: {
            from: "categories",
            foreignField: "_id",
            localField: "categories",
            as: "categories",
          },
        },
        { $unwind: "$categories" },
        {
          $project: {
            "categories._id": 0,
            "categories.__v": 0,
          },
        },
      ]);
      return courses;
    } catch (error) {
      createError.InternalServerError(error.message ?? error);
    }
  }
  async addCourse(req, res, next) {
    try {
      if (!req.file) {
        throw createError.BadRequest("you should at leas choose one image");
      }
      let data = req.body;
      const validItems = [
        "title",
        "brief_text",
        "description",
        "image",
        "tags",
        "categories",
        "price",
        "discount",
        "status",
        "value",
        "time",
        "teacher",
      ];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          throw createError.BadRequest("invalid key sent");
        }
      });
      const protocol = req.protocol;
      const host = req.get("host");
      const imageAddress =
        protocol +
        "://" +
        host +
        "/" +
        req.file?.path?.substring(req.file.path.indexOf("uploads"));
      data.image = imageAddress;
      const course = await courseModel.create(data);
      if (!course) {
        throw createError.InternalServerError("creating course failed");
      }
      return res.status(200).json({
        status: 200,
        course,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async editCourse(req, res, next) {
    try {
      return res.send("hello");
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async removeCourse(req, res, next) {
    try {
      const { id: _id } = req.params;
      const remove = await courseModel.deleteOne({ _id });
      if (remove.deletedCount === 0) {
        throw createError.InternalServerError("deleting course failed");
      }
      return res.status(200).json({
        status: 200,
        remove,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async getCourseList(req, res, next) {
    try {
      const courses = await this.aggregateCourse();
      if (!courses || courses.length === 0) {
        throw createError.NotFound("no course found");
      }
      return res.status(200).json({
        status: 200,
        courses,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await this.aggregateCourse(id);
      if (!course || course.length === 0) {
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
}

module.exports = new CourseController();
