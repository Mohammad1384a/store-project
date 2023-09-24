const { Router } = require("express");
const router = Router();
const PermissionController = require("../../http/controllers/user/permission.controller");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const {
  permissionValiator,
  editPermissionValidtor,
} = require("../../http/validators/user/role.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { validateId } = require("../../http/validators/admin/product.validator");

router.post(
  "/add",
  isUserAdmin,
  permissionValiator(),
  validationMapper,
  PermissionController.addPermission
);

router.delete(
  "/remove/:id",
  isUserAdmin,
  validateId(),
  validationMapper,
  PermissionController.removePermission
);

router.get(
  "/all",
  isUserAdmin,
  validationMapper,
  PermissionController.getPermissionList
);

router.put(
  "/edit/:id",
  isUserAdmin,
  validateId(),
  editPermissionValidtor(),
  validationMapper,
  PermissionController.editPemission
);

module.exports = {
  permissionRouter: router,
};
