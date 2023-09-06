const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  parent: { type: mongoose.Types.ObjectId },
});

module.exports = {
  CommentSchema,
};
