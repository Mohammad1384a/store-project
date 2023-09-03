const { Router } = require("express");
const router = Router();
const BlogController = require("../../http/controllers/admin/blog.controller");
const { uploadFile } = require("../../http/middlewares/multer");
const { isUserLoggedIn } = require("../../http/middlewares/isUserLoggedIn");
const {
  blogValidator,
  validateId,
} = require("../../http/validators/admin/blog.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.post(
  "/add",
  blogValidator(),
  isUserLoggedIn,
  validationMapper,
  uploadFile.single("image"),
  BlogController.addBlog
);

router.get(
  "/all",
  isUserLoggedIn,
  validationMapper,
  BlogController.getBlogList
);

router.get(
  "/:id",
  validateId(),
  isUserLoggedIn,
  validationMapper,
  BlogController.getBlogById
);

router.delete(
  "/remove/:id",
  validateId(),
  isUserLoggedIn,
  validationMapper,
  BlogController.removeBlog
);

module.exports = {
  blogRouter: router,
};
