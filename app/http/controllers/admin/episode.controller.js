const Controller = require("../controller");
const { ObjectId } = require("mongodb");
const { courseModel } = require("../../../models/course.model");
const createError = require("http-errors");
const { getVideoDurationInSeconds } = require("get-video-duration");

class EpisodeController extends Controller {
  async addEpisode(req, res, next) {
    try {
      const { title, body, value } = req.body;
      const { id: chapterId } = req.params;
      if (!req.file) {
        throw createError.BadRequest("you should a video for your episode");
      }
      const duration = Math.floor(
        await getVideoDurationInSeconds(req.file.path)
      );
      const date = new Date(duration * 1000);
      const hours = date.getUTCHours();
      const mintuse = date.getUTCMinutes();
      const seconds = date.getSeconds();
      const time =
        hours.toString().padStart(2, "0") +
        ":" +
        mintuse.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
      const protocol = req.protocol;
      const host = req.get("host");
      const videoPath =
        protocol +
        "://" +
        host +
        "/" +
        req.file?.path?.substring(req.file.path.indexOf("uploads"));
      const data = {
        title,
        body,
        value,
        videoPath,
        time,
      };
      const episode = await courseModel.updateOne(
        {
          "chapters._id": chapterId,
        },
        { $push: { "chapters.$.episodes": data } }
      );
      if (episode.modifiedCount === 0) {
        throw createError.InternalServerError("creating episode failed");
      }
      return res.status(200).json({
        staus: 200,
        episode,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async removeEpisode(req, res, next) {
    try {
      const { id: episodeId } = req.params;
      const remove = await courseModel.updateOne(
        { "chapters.episodes._id": episodeId },
        { $pull: { "chapters.$.episodes": { _id: new ObjectId(episodeId) } } }
      );
      if (remove.modifiedCount === 0) {
        throw createError.InternalServerError("removing episode failed");
      }
      return res.status(200).json({
        status: 200,
        remove,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
  async editEpisode(req, res, next) {
    try {
      return res.send("hello");
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new EpisodeController();
