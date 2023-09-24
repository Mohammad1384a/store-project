const { Router } = require("express");
const router = Router();
const PermissionController = require("../../http/controllers/user/permission.controller");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const {
  permissionValiator,
} = require("../../http/validators/user/role.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.post(
  "/add",
  // isUserAdmin,
  permissionValiator(),
  validationMapper,
  PermissionController.addPermission
);

module.exports = {
  permissionRouter: router,
};
