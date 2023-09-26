const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  title: { type: String, unique: true, required: true, uppercase: true },
});

const roleModel = mongoose.model("roles", Schema);

module.exports = {
  roleModel,
};
