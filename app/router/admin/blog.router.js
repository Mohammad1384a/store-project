const { Router } = require("express");
const router = Router();
const BlogController = require("../../http/controllers/admin/blog.controller");
const { uploadFile } = require("../../http/middlewares/multer");
const {
  blogValidator,
  validateId,
  updateBlogValidator,
} = require("../../http/validators/admin/blog.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.post(
  "/add",
  blogValidator(),
  validationMapper,
  uploadFile.single("image"),
  BlogController.addBlog
);

router.get("/all", BlogController.getBlogList);

router.get("/:id", validateId(), validationMapper, BlogController.getBlogById);

router.delete(
  "/remove/:id",
  validateId(),
  validationMapper,
  BlogController.removeBlog
);

router.put(
  "/edit/:id",
  validateId(),
  updateBlogValidator(),
  validationMapper,
  BlogController.editBlog
);

router.get(
  "/comments/:id",
  validateId(),
  validationMapper,
  BlogController.getBlogComments
);

module.exports = {
  blogRouter: router,
};
