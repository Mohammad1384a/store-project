const { Router } = require("express");
const router = Router();
const BlogController = require("../../http/controllers/admin/blog.controller");
const { uploadFile } = require("../../http/middlewares/multer");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const {
  blogValidator,
  validateId,
  updateBlogValidator,
} = require("../../http/validators/admin/blog.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.post(
  "/add",
  blogValidator(),
  isUserAdmin,
  validationMapper,
  uploadFile.single("image"),
  BlogController.addBlog
);

router.get("/all", isUserAdmin, validationMapper, BlogController.getBlogList);

router.get(
  "/:id",
  validateId(),
  isUserAdmin,
  validationMapper,
  BlogController.getBlogById
);

router.delete(
  "/remove/:id",
  validateId(),
  isUserAdmin,
  validationMapper,
  BlogController.removeBlog
);

router.put(
  "/edit/:id",
  isUserAdmin,
  validateId(),
  updateBlogValidator(),
  validationMapper,
  BlogController.editBlog
);

router.get(
  "/comments/:id",
  validateId(),
  isUserAdmin,
  validationMapper,
  BlogController.getBlogComments
);

module.exports = {
  blogRouter: router,
};
