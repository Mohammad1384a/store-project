const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.model");

const Expisodes = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  value: { type: String, default: "locked" }, // locked,unlocked
  time: { type: String, required: true },
  videoPath: { type: String, required: true },
});

const Chapter = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  episodes: { type: [Expisodes], default: [] },
});

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  brief_text: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  tags: { type: [String], default: [] },
  categories: {
    type: [String],
    ref: "categories",
    required: true,
  },
  comments: { type: [CommentSchema], default: [] },
  likes: { type: [mongoose.Types.ObjectId], default: [] },
  bookmarks: { type: [mongoose.Types.ObjectId], default: [] },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  status: { type: String, default: "notStarted" }, // notStarted, onGoing, done
  value: { type: String, default: "free" }, // free, monetary, premium
  total_time: { type: String, default: "00:00:00" },
  teacher: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  chapters: { type: [Chapter], default: [] },
  students: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
});

const courseModel = mongoose.model("course", Schema);
module.exports = {
  courseModel,
};
