const { Router } = require("express");
const router = Router();
const RoleConroller = require("../../http/controllers/user/role.controller");
const {
  roleValidator,
  editRoleValidator,
} = require("../../http/validators/user/role.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { validateId } = require("../../http/validators/admin/product.validator");

router.post("/add", roleValidator(), validationMapper, RoleConroller.addRole);

router.get("/all", RoleConroller.getRolesList);

router.delete(
  "/remove/:id",
  validateId(),
  validationMapper,
  RoleConroller.removeRole
);

router.put(
  "/edit/:id",
  validateId(),
  editRoleValidator(),
  validationMapper,
  RoleConroller.editRole
);

module.exports = {
  roleRouter: router,
};
