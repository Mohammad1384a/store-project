const { Router } = require("express");
const { authRouter } = require("./auth.router");
const UserController = require("../../http/controllers/user/user.controller");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");
const { validationMapper } = require("../../http/validators/validationMapper");
const router = Router();

router.get("/all", validationMapper, UserController.getUserList);
router.use("/auth", authRouter);

module.exports = {
  userRouter: router,
};
