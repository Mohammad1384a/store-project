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

router.use("/auth", authRouter);
router.use("/role", isUserPermitted(["ADMIN"]), roleRouter);
router.get("/all", isUserPermitted(["ADMIN"]), UserController.getUserList);
router.put(
  "/edit/:id",
  validateId(),
  editUserValidator(),
  UserController.editUser
);

router.get(
  "/:id",
  isUserPermitted(["ADMIN"]),
  validateId(),
  UserController.getUserById
);

module.exports = {
  userRouter: router,
};
