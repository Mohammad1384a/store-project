const { Router } = require("express");
const { categoryRouter } = require("./category.router");
const router = Router();

router.use("/category", categoryRouter);

module.exports = {
  adminRouter: router,
};
