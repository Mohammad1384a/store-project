const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({
  title: { type: String },
  text: { type: String },
  image: { type: String, required: true },
  type: { type: String, default: "main" },
});

const model = mongoose.model("slider", Schema);

module.exports = {
  sliderModel: model,
};
