const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({});

const model = mongoose.model("payment", Schema);

module.exports = {
  paymentModel: model,
};
