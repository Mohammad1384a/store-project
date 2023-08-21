const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({});

const model = mongoose.model("payment", Schema);

module.exports = {
  paymentModel: model,
};
