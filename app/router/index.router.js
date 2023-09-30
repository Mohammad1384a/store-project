const { Router } = require("express");
const { userRouter } = require("./user/user.router");
const HomeController = require("../http/controllers/api/home.controller");
const { devRouter } = require("./dev.router");
const { adminRouter } = require("./admin/admin.router");
const { isUserPermitted } = require("../http/middlewares/isUserPermitted");
const router = Router();
const { graphqlConfig } = require("../graphql/graphql.config");
const { graphqlHTTP } = require("express-graphql");

router.get("/", HomeController.indexPage);
router.use("/graphql", graphqlHTTP(graphqlConfig));
router.use("/user", userRouter);
router.use("/dev", devRouter);
router.use(
  "/admin",
  isUserPermitted(["TEACHER", "BLOG", "VENDOR"]),
  adminRouter
);

module.exports = {
  AllRoutes: router,
};
