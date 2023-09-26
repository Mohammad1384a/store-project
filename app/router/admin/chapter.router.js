const { Router } = require("express");
const router = Router();
const ChapterController = require("../../http/controllers/admin/chapter.controller");
const { validationMapper } = require("../../http/validators/validationMapper");
const {
  chapterValidator,
} = require("../../http/validators/admin/chapter.validator");
const { validateId } = require("../../http/validators/admin/product.validator");
const { episodeRouter } = require("./episode.router");

router.use("/episode", episodeRouter);

router.put(
  "/add/:id",
  chapterValidator(),
  validateId(),
  validationMapper,
  ChapterController.addChapter
);

router.get(
  "/:id",
  validateId(),
  validationMapper,
  ChapterController.getCourseChapters
);

router.delete(
  "/remove/:id",
  validateId(),
  validationMapper,
  ChapterController.removeChapter
);

router.put(
  "/edit/:id",
  validateId(),
  validationMapper,
  ChapterController.editChapter
);

module.exports = {
  chapterRouter: router,
};
