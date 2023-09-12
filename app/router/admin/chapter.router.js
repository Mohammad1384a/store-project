const { Router } = require("express");
const router = Router();
const ChapterController = require("../../http/controllers/admin/chapter.controller");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const { validationMapper } = require("../../http/validators/validationMapper");
const {
  chapterValidator,
} = require("../../http/validators/admin/chapter.validator");
const { validateId } = require("../../http/validators/admin/product.validator");

router.post(
  "/add/:id",
  isUserAdmin,
  chapterValidator(),
  validateId(),
  validationMapper,
  ChapterController.addChapter
);

router.get(
  "/:id",
  validateId(),
  isUserAdmin,
  validationMapper,
  ChapterController.getCourseChapters
);

router.delete(
  "/remove/:courseId/:id",
  isUserAdmin,
  validateId(),
  validationMapper,
  ChapterController.removeChapter
);

module.exports = {
  chapterRouter: router,
};
