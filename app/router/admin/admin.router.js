const { Router } = require("express");
const { categoryRouter } = require("./category.router");
const { blogRouter } = require("./blog.router");
const router = Router();

router.use("/category", categoryRouter);
router.use("/blog", blogRouter);

module.exports = {
  adminRouter: router,
};
