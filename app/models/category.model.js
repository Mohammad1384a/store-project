const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({
  title: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, default: undefined },
});

const model = mongoose.model("category", Schema);

module.exports = {
  categoryModel: model,
};
