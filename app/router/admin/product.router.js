const { Router } = require("express");
const router = Router();
const ProductController = require("../../http/controllers/admin/product.controller");
const {
  productValidator,
} = require("../../http/validators/admin/product.validator");
const { validationMapper } = require("../../http/validators/validationMapper");
const { uploadFile } = require("../../http/middlewares/multer");
const { isUserAdmin } = require("../../http/middlewares/isUserAdmin");

router.post(
  "/add",
  productValidator(),
  isUserAdmin,
  validationMapper,
  uploadFile.array("images", 5),
  ProductController.addProduct
);

router.get(
  "/all",
  // isUserAdmin,
  validationMapper,
  ProductController.getProductList
);

module.exports = {
  productRouter: router,
};
