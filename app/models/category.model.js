const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "user", default: undefined },
});

const model = mongoose.model("category", Schema);

module.exports = {
  categoryModel: model,
};
