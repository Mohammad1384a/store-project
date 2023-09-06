const { Router } = require("express");
const { categoryRouter } = require("./category.router");
const { blogRouter } = require("./blog.router");
const { productRouter } = require("./product.router");
const router = Router();

router.use("/category", categoryRouter);
router.use("/blog", blogRouter);
router.use("/product", productRouter);

module.exports = {
  adminRouter: router,
};
