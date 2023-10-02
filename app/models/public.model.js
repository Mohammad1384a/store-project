const { default: mongoose } = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    show: { type: Boolean, default: false },
    comment: { type: String, required: true },
  },
  { timestamps: { createdAt: true } }
);

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    show: { type: Boolean, default: false },
    conmmentPermitted: { type: Boolean, default: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    replies: { type: [replySchema], default: [] },
  },
  {
    timestamps: { createdAt: true },
  }
);

module.exports = {
  CommentSchema,
};
