const { Router } = require("express");
const router = Router();
const ProductController = require("../../http/controllers/admin/product.controller");
const {
  productValidator,
} = require("../../http/validators/admin/product.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.post(
  "/add",
  productValidator(),
  validationMapper,
  ProductController.addProduct
);

module.exports = {
  productRouter: router,
};
