const Controller = require("../controller");
const { courseModel } = require("../../../models/course.model");
const createError = require("http-errors");
const moment = require("moment");
const momentDuration = require("moment-duration-format");
const { ObjectId } = require("mongodb");

class CourseController extends Controller {
  createImageAddress(file, protocol, host) {
    const imageAddress =
      protocol +
      "://" +
      host +
      "/" +
      file?.path?.substring(file.path.indexOf("uploads"));
    return imageAddress;
  }
  getTotalTime(chapters) {
    let allEpisodes = [];
    for (let chapter of chapters) {
      for (let episode of chapter.episodes) {
        allEpisodes.push(episode);
      }
    }
    let totalTime = "00:00:00";
    for (let item of allEpisodes) {
      totalTime = moment
        .duration(totalTime)
        .add(moment.duration(item.time))
        .format("hh:mm:ss", { trim: false });
    }
    return totalTime;
  }
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
        next(createError.BadRequest("you should at leas choose one image"));
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
          next(createError.BadRequest("invalid key sent"));
        }
      });
      if (req.file) {
        const imageAddress = this.createImageAddress(
          req.file,
          req.protocol,
          req.get("host")
        );
        data.image = imageAddress;
      }
      const course = await courseModel.create(data);
      if (!course) {
        next(createError.InternalServerError("creating course failed"));
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
      const { id: courseId } = req.params;
      const data = req.body;
      const validItems = [
        "title",
        "description",
        "brif_text",
        "tags",
        "categories",
        "price",
        "discount",
        "status",
        "value",
        "teacher",
      ];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          next(createError.BadRequest("invalid item sent"));
        }
        if (!data[key] || data[key].length === 0) {
          next(createError.BadRequest("invalid value sent"));
        }
      });
      if (req.file) {
        const imageAddress = this.createImageAddress(
          req.file,
          req.protocol,
          req.get("host")
        );
        data.image = imageAddress;
      }
      const update = await courseModel.updateOne(
        { _id: courseId },
        { $set: data }
      );
      if (update.modifiedCount === 0) {
        next(createError.InternalServerError("updating course failed"));
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async removeCourse(req, res, next) {
    try {
      const { id: _id } = req.params;
      const remove = await courseModel.deleteOne({ _id });
      if (remove.deletedCount === 0) {
        next(createError.InternalServerError("deleting course failed"));
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
        next(createError.NotFound("no course found"));
      }
      for (let i = 0; i < courses.length; i++) {
        let chapters = [];
        for (let chapter of courses[i].chapters) {
          chapters.push(chapter);
        }
        const totalTime =
          chapters.length > 0 ? this.getTotalTime(chapters) : "00:00:00";
        courses[i].totalTime = totalTime;
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
        next(createError.NotFound("not found course"));
      }
      // gather all episodes for calculating total time
      const chapters = course[0].chapters;
      const totalTime =
        chapters.length > 0 ? this.getTotalTime(chapters) : "00:00:00";
      course[0].totalTime = totalTime;
      return res.status(200).json({
        status: 200,
        course: course[0],
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new CourseController();
