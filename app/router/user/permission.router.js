const { Router } = require("express");
const router = Router();
const PermissionController = require("../../http/controllers/user/permission.controller");

router.get("/", PermissionController.getPermissionList);

module.exports = {
  permissionRouter: router,
};
