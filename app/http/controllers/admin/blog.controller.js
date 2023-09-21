const Controller = require("../controller");
const { blogModel } = require("../../../models/blog.model");
const createError = require("http-errors");

class BlogController extends Controller {
  async addBlog(req, res, next) {
    try {
      const { title, author, brief_text, categories } = req.body;
      const address = req.file.path.indexOf("uploads");
      const imageAddress =
        req.protocol +
        "://" +
        req.get("host") +
        "/" +
        req.file?.path?.substring(address);
      const blog = await blogModel.create({
        title,
        author,
        brief_text,
        image: imageAddress,
        categories,
      });
      if (!blog) {
        return next(createError.InternalServerError("creating blog failed"));
      }
      return res.status(200).json({
        status: 200,
        blog,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getBlogList(req, res, next) {
    try {
      const blogs = await blogModel.aggregate([
        { $match: {} },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "author",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            "author.otp": 0,
            "author.bills": 0,
            "author.discount": 0,
            "author.token": 0,
            "author.refreshToken": 0,
            "author.roles": 0,
            "author.__v": 0,
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
        {
          $project: {
            "categories.__v": 0,
            "categories.parent": 0,
          },
        },
      ]);
      if (!blogs || blogs.length === 0) {
        return next(createError.NotFound("no blog found"));
      }
      return res.status(200).json({
        status: 200,
        blogs,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getBlogById(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await blogModel.findById(id);
      if (!blog) {
        return next(createError.NotFound("Blog not found"));
      }
      return res.status(200).json({
        status: 200,
        blog,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async removeBlog(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await blogModel.deleteOne({ _id: id });
      if (blog.deletedCount === 0) {
        return next(createError.InternalServerError("deleting blog failed"));
      }
      return res.status(200).json({
        status: 200,
        blog,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async editBlog(req, res, next) {
    try {
      const { id } = req.params;
      let data = req.body;
      const validEntries = [
        "categories",
        "title",
        "brief_text",
        "image",
        "tags",
      ];
      Object.keys(data).forEach((key) => {
        if (!validEntries.includes(key)) {
          delete data[key];
        }
      });
      const update = await blogModel.updateOne({ _id: id }, { $set: data });
      if (update.modifiedCount === 0) {
        return next(createError.InternalServerError("updating Blog failed"));
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getBlogComments(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await blogModel.findById(id);
      if (!blog) {
        return next(createError.NotFound("not found blog"));
      }
      if (blog.comments.length === 0) {
        return next(createError.NotFound("blog has no comments"));
      }
      return res.status(200).json({
        status: 200,
        comments: blog.comments,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
}

module.exports = new BlogController();
