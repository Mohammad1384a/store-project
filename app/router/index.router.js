const { Router } = require("express");
const { userRouter } = require("./user/user.router");
const { devRouter } = require("./dev.router");
const { adminRouter } = require("./admin/admin.router");
const { isUserPermitted } = require("../http/middlewares/isUserPermitted");
const router = Router();
const { graphqlConfig } = require("../graphql/graphql.config");
const { graphqlHTTP } = require("express-graphql");
const { paymentRouter } = require("./api/payment.router");

router.use("/payment", paymentRouter);
router.use("/graphql", graphqlHTTP(graphqlConfig));
router.use("/user", userRouter);
router.use("/dev", devRouter);
router.use(
  "/admin",
  isUserPermitted(["TEACHER", "BLOGGER", "VENDOR"]),
  adminRouter
);

module.exports = {
  AllRoutes: router,
};
