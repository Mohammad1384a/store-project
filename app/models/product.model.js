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
  dislikes: { type: [mongoose.Types.ObjectId], default: [] },
  bookmarks: { type: [mongoose.Types.ObjectId], default: [] },
  price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  quentity: { type: Number, default: 0 },
  type: { type: String, required: true }, // virtual,physical
  format: { type: String },
  teacher: { type: mongoose.Types.ObjectId, required: true },
  features: {
    type: Object,
    default: {
      length: 0,
      height: 0,
      width: 0,
      weight: 0,
      colors: [],
      model: [],
      made_in: "",
    },
  },
});

Schema.index({ title: "text", brief_text: "text", body: "text" });

const model = mongoose.model("product", Schema);

module.exports = {
  productModel: model,
};
