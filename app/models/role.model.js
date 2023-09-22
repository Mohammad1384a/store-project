const mongoose = require("mongoose");

const PermissionSchema = {
  title: { type: String, unique: true, required: true },
  description: { type: String, default: "" },
};

const Schema = new mongoose.Schema({
  title: { type: String, unique: true, required: true, uppercase: true },
  permissions: {
    type: [mongoose.Types.ObjectId],
    ref: "permissions",
    default: [],
  },
});

const roleModel = mongoose.model("roles", Schema);
const permissionModel = mongoose.model("permission", PermissionSchema);

module.exports = {
  roleModel,
  permissionModel,
};
