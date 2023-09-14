const { Router } = require("express");
const router = Router();
const EpisodeController = require("../../http/controllers/admin/episode.controller");
const {
  episodeValidator,
} = require("../../http/validators/admin/chapter.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const { uploadVideo } = require("../../http/middlewares/multer");
const { validateId } = require("../../http/validators/admin/product.validator");

router.post(
  "/add/:id",
  //   isUserAdmin,
  validateId(),
  //   episodeValidator(),
  validationMapper,
  uploadVideo.single("video"),
  EpisodeController.addEpisode
);

module.exports = {
  episodeRouter: router,
};
