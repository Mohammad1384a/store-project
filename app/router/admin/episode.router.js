const { Router } = require("express");
const router = Router();
const EpisodeController = require("../../http/controllers/admin/episode.controller");
const {
  episodeValidator,
  updateEpisodeValidator,
} = require("../../http/validators/admin/chapter.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { uploadVideo } = require("../../http/middlewares/multer");
const { validateId } = require("../../http/validators/admin/product.validator");

router.put(
  "/add/:id",
  validateId(),
  episodeValidator(),
  validationMapper,
  uploadVideo.single("video"),
  EpisodeController.addEpisode
);

router.delete(
  "/remove/:id",
  validateId(),
  validationMapper,
  EpisodeController.removeEpisode
);

router.put(
  "/edit/:id",
  validateId(),
  updateEpisodeValidator(),
  validationMapper,
  uploadVideo.single("video"),
  EpisodeController.editEpisode
);

module.exports = {
  episodeRouter: router,
};
