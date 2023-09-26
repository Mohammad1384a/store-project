const { Router } = require("express");
const { categoryRouter } = require("./category.router");
const { blogRouter } = require("./blog.router");
const { productRouter } = require("./product.router");
const { courseRouter } = require("./course.router");
const { isUserPermitted } = require("../../http/middlewares/isUserPermitted");
const router = Router();

router.use("/category", isUserPermitted(["VENDOR"]), categoryRouter);
router.use("/blog", isUserPermitted(["BLOG"]), blogRouter);
router.use("/product", isUserPermitted(["VENDOR"]), productRouter);
router.use("/course", isUserPermitted(["TEACHER"]), courseRouter);

module.exports = {
  adminRouter: router,
};
