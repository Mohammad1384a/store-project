const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({});

const model = mongoose.model("blog", Schema);

module.exports = {
  blogModel: model,
};
