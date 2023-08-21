const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String, lowercase: true, unique: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String },
  password: { type: String },
  otp: {
    type: Object,
    default: {
      code: "0",
      expiresIn: 0,
    },
  },
  bills: { type: [], default: [] },
  discount: { type: Number, default: 0 },
  birthday: { type: String },
  token: { type: String, default: "" },
  refreshToken: { type: String, default: "" },
  roles: { type: [], default: ["USER"] },
});

const model = mongoose.model("user", Schema);

module.exports = {
  userModel: model,
};
