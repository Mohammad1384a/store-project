const { Router } = require("express");
const router = Router();
const CourseController = require("../../http/controllers/admin/course.controller");
const { chapterRouter } = require("./chapter.router");
const {
  courseValidator,
  editCourseValidator,
} = require("../../http/validators/admin/course.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { uploadFile } = require("../../http/middlewares/multer");
const { validateId } = require("../../http/validators/admin/product.validator");

router.use("/chapter", chapterRouter);

router.post(
  "/add",
  uploadFile.single("image"),
  courseValidator(),
  validationMapper,
  CourseController.addCourse
);

router.get("/all", CourseController.getCourseList);

router.get(
  "/:id",
  validateId(),
  validationMapper,
  CourseController.getCourseById
);

router.delete(
  "/remove/:id",
  validateId(),
  validationMapper,
  CourseController.removeCourse
);

router.put(
  "/edit/:id",
  validateId(),
  editCourseValidator(),
  validationMapper,
  uploadFile.single("image"),
  CourseController.editCourse
);

module.exports = {
  courseRouter: router,
};
