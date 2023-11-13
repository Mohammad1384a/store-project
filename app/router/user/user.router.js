const { Router } = require("express");
const { roleRouter } = require("./role.router");
const { authRouter } = require("./auth.router");
const UserController = require("../../http/controllers/user/user.controller");
const { validateId } = require("../../http/validators/admin/product.validator");
const {
  editUserValidator,
} = require("../../http/validators/user/editUser.validator");
const router = Router();
const { isUserPermitted } = require("../../http/middlewares/isUserPermitted");
const { validationMapper } = require("../../http/validators/validationMapper");

router.use("/auth", authRouter);
router.use("/role", isUserPermitted(["ADMIN"]), roleRouter);
router.get("/all", isUserPermitted(["ADMIN"]), UserController.getUserList);
router.put(
  "/edit/:id",
  validateId(),
  editUserValidator(),
  isUserPermitted(["USER"]),
  validationMapper,
  UserController.editUser
);

router.get(
  "/:id",
  isUserPermitted(["USER"]),
  validateId(),
  validationMapper,
  UserController.getUserById
);

router.delete(
  "/remove/:id",
  isUserPermitted(["ADMIN"]),
  validateId(),
  validationMapper,
  UserController.removeUserById
);

module.exports = {
  userRouter: router,
};
