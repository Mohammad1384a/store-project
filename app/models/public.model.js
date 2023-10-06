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

const ProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String, required: true },
  images: { type: [String], required: true },
  vendor: { type: mongoose.Types.ObjectId, required: true },
  count: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
});

const CourseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Types.ObjectId, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  total_time: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
});

const BasketSchema = new mongoose.Schema({
  courses: { type: [CourseSchema], default: [] },
  products: { type: [ProductSchema], default: [] },
});

module.exports = {
  CommentSchema,
  BasketSchema,
};
