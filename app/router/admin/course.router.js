const { Router } = require("express");
const router = Router();
const CourseController = require("../../http/controllers/admin/course.controller");
const { chapterRouter } = require("./chapter.router");
const {
  courseValidator,
} = require("../../http/validators/admin/course.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const { uploadFile } = require("../../http/middlewares/multer");
const { validateId } = require("../../http/validators/admin/product.validator");

router.use("/chapter", chapterRouter);

router.post(
  "/add",
  courseValidator(),
  isUserAdmin,
  validationMapper,
  uploadFile.single("image"),
  CourseController.addCourse
);

router.get(
  "/all",
  isUserAdmin,
  validationMapper,
  CourseController.getCourseList
);

router.get(
  "/:id",
  isUserAdmin,
  validateId(),
  validationMapper,
  CourseController.getCourseById
);

module.exports = {
  courseRouter: router,
};
