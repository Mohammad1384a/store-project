const { Router } = require("express");
const { roleRouter } = require("./role.router");
const { authRouter } = require("./auth.router");
const UserController = require("../../http/controllers/user/user.controller");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const { validationMapper } = require("../../http/validators/validationMapper");
const { validateId } = require("../../http/validators/admin/product.validator");
const {
  editUserValidator,
} = require("../../http/validators/user/editUser.validator");
const { isUserLoggedIn } = require("../../http/middlewares/isUserLoggedIn");
const router = Router();

router.use("/auth", authRouter);
router.use("/role", roleRouter);
router.get("/all", isUserAdmin, validationMapper, UserController.getUserList);
router.put(
  "/edit/:id",
  isUserLoggedIn,
  validateId(),
  editUserValidator(),
  validationMapper,
  UserController.editUser
);

router.get(
  "/:id",
  validateId(),
  isUserLoggedIn,
  validationMapper,
  UserController.getUserById
);

module.exports = {
  userRouter: router,
};
