const { Router } = require("express");
const RoleConroller = require("../../http/controllers/user/role.controller");
const router = Router();
const { permissionRouter } = require("./permission.router");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const {
  roleValidator,
  editRoleValidator,
} = require("../../http/validators/user/role.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { validateId } = require("../../http/validators/admin/product.validator");

router.use("/permission", permissionRouter);
router.post(
  "/add",
  isUserAdmin,
  roleValidator(),
  validationMapper,
  RoleConroller.addRole
);

router.get("/all", isUserAdmin, validationMapper, RoleConroller.getRolesList);

router.delete(
  "/remove/:id",
  isUserAdmin,
  validateId(),
  validationMapper,
  RoleConroller.removeRole
);

router.put(
  "/edit/:id",
  // isUserAdmin,
  validateId(),
  editRoleValidator(),
  validationMapper,
  RoleConroller.editRole
);

module.exports = {
  roleRouter: router,
};
