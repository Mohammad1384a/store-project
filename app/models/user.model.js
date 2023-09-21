const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
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
    courses: { type: [mongoose.Types.ObjectId], ref: "courses", default: [] },
    token: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    roles: { type: [], default: ["USER"] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Schema.index({
  username: "text",
  phone: "text",
  first_name: "text",
  last_name: " text",
  email: "text",
});

const model = mongoose.model("user", Schema);

module.exports = {
  userModel: model,
};
