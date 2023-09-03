const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  parent: { type: mongoose.Types.ObjectId },
});

const Schema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, required: true },
    brief_text: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    categories: { type: [mongoose.Types.ObjectId], required: true },
    comments: { type: [CommentSchema], default: [] },
    likes: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
    bookmarks: { type: [mongoose.Types.ObjectId], ref: "users", default: [] },
  },
  { timeStamps: true, versionKey: false }
);

const model = mongoose.model("blog", Schema);

module.exports = {
  blogModel: model,
};
