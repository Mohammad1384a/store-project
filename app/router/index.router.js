const { Router } = require("express");
const { userRouter } = require("./user/user.router");
const HomeController = require("../http/controllers/api/home.controller");
const router = Router();

router.get("/", HomeController.indexPage);
router.use("/user", userRouter);

module.exports = {
  AllRoutes: router,
};
