const Controller = require("../controller");
const { courseModel } = require("../../../models/course.model");
const createError = require("http-errors");
const { getVideoDurationInSeconds } = require("get-video-duration");
const { ObjectId } = require("mongodb");

class EpisodeController extends Controller {
  async videoAddress(video, protocol, host) {
    const duration = Math.floor(await getVideoDurationInSeconds(video.path));
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
    const videoPath =
      protocol +
      "://" +
      host +
      "/" +
      video.path?.substring(video.path.indexOf("uploads"));
    return { videoPath, time };
  }
  async addEpisode(req, res, next) {
    try {
      const { title, body, value } = req.body;
      const { id: chapterId } = req.params;
      if (!req.file) {
        next(createError.BadRequest("you should a video for your episode"));
      }
      const { time, videoPath } = await this.videoAddress(
        req.file,
        req.protocol,
        req.get("host")
      );
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
        next(createError.InternalServerError("creating episode failed"));
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
        next(createError.InternalServerError("removing episode failed"));
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
      const { id: episodeId } = req.params;
      const data = req.body;
      const validItems = ["title", "body", "value"];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          next(createError.BadRequest("invalid key sent"));
        }
        if (!data[key] || data[key].length === 0) {
          next(createError.BadRequest("bad value sent"));
        }
      });
      const course = await courseModel.findOne(
        {
          "chapters.episodes._id": episodeId,
        },
        { chapters: 1 }
      );
      if (!course) {
        next(createError.NotFound("not found episode"));
      }
      const result = course.chapters;
      const videoAddress = req.file
        ? await this.videoAddress(req.file, req.protocol, req.get("host"))
        : null;
      // find the specific episode and update it locally
      let clone = null;
      for (let chapter of result) {
        chapter.episodes.find((episode) => {
          if (episode._id.equals(episodeId)) {
            clone = episode;
          }
        });
      }
      if (videoAddress) {
        clone.videoPath = videoAddress.videoPath;
        clone.time = videoAddress.time;
      }
      Object.keys(data).forEach((key) => {
        clone[key] = data[key];
      });
      // find episodes of a certain chapter in order to update it on db
      let episodes = null;
      for (let chapter of result) {
        chapter.episodes.forEach((episode) => {
          if (episode._id.equals(episodeId)) {
            return (episodes = chapter.episodes);
          }
        });
      }
      // update the specific episode
      episodes.map((episode) => {
        if (episode._id.equals(episodeId)) {
          return (episode = clone);
        }
      });
      const update = await courseModel.updateOne(
        { "chapters.episodes._id": episodeId },
        { $set: { "chapters.$.episodes": episodes } }
      );
      if (update.modifiedCount === 0) {
        next(createError.InternalServerError("updating episode failed"));
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error.message ?? error));
    }
  }
}

module.exports = new EpisodeController();
