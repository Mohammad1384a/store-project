const { Router } = require("express");
const { authRouter } = require("./auth.router");
const UserController = require("../../http/controllers/user/user.controller");
const router = Router();

router.get("/all", UserController.getUserList);
router.use("/auth", authRouter);

module.exports = {
  userRouter: router,
};
