const Controller = require("../controller");
const { blogModel } = require("../../../models/blog.model");
const createError = require("http-errors");

class BlogController extends Controller {
  async addBlog(req, res, next) {
    try {
      // const { title, author, brief_text, categories } = req.body;
      const title = "hello I'm some title3";
      const author = "64f455b49128e3b0142a4709";
      const brief_text = "hello I'm some brief text3";
      const categories = [
        "64edf1d70e0331caf6f6d484",
        "64edf1c30e0331caf6f6d482",
      ];
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
        throw createError.InternalServerError("creating blog failed");
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
      console.log(blogs);
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
        throw createError.NotFound("Blog not found");
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
        throw createError.InternalServerError("deleting blog failed");
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
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getBlogComments(req, res, next) {
    try {
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
}

module.exports = new BlogController();
