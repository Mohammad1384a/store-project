const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.model");

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  brief_text: { type: String, required: true },
  body: { type: String, required: true },
  images: { type: [String], required: true },
  tags: { type: [String], default: [] },
  categories: {
    type: [mongoose.Types.ObjectId],
    ref: "categories",
    required: true,
  },
  comments: { type: [CommentSchema], default: [] },
  likes: { type: [mongoose.Types.ObjectId], default: [] },
  bookmarks: { type: [mongoose.Types.ObjectId], default: [] },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  quentity: { type: Number, default: 0 },
  vendor: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  features: {
    type: Object,
    default: {
      length: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      weight: { type: Number, default: 0 },
      colors: { type: [String], default: [] },
      model: { type: String, default: "" },
    },
  },
});

const model = mongoose.model("product", Schema);

module.exports = {
  productModel: model,
};
