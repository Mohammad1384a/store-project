const { Router } = require("express");
const RoleConroller = require("../../http/controllers/user/role.controller");
const router = Router();
const { permissionRouter } = require("./permission.router");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const { roleValidator } = require("../../http/validators/user/role.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.use("/permission", permissionRouter);
router.post(
  "/add",
  isUserAdmin,
  roleValidator(),
  validationMapper,
  RoleConroller.addRole
);

router.get("/all", isUserAdmin, validationMapper, RoleConroller.getRolesList);

module.exports = {
  roleRouter: router,
};
