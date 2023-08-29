const { Router } = require("express");
const { userRouter } = require("./user/user.router");
const HomeController = require("../http/controllers/api/home.controller");
const { devRouter } = require("./dev.router");
const { adminRouter } = require("./admin/admin.router");
const router = Router();

router.get("/", HomeController.indexPage);
router.use("/user", userRouter);
router.use("/dev", devRouter);
router.use("/admin", adminRouter);

module.exports = {
  AllRoutes: router,
};
