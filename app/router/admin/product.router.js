const { Router } = require("express");
const router = Router();
const ProductController = require("../../http/controllers/admin/product.controller");
const {
  productValidator,
  updateProductValidator,
  validateId,
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
  isUserAdmin,
  validationMapper,
  ProductController.getProductList
);

router.get(
  "/:id",
  validateId(),
  isUserAdmin,
  validationMapper,
  ProductController.getProductById
);

router.delete(
  "/:id",
  validateId(),
  isUserAdmin,
  validationMapper,
  ProductController.removeProduct
);

router.put(
  "/edit/:id",
  validateId(),
  updateProductValidator(),
  isUserAdmin,
  validationMapper,
  uploadFile.array("images", 5),
  ProductController.editProduct
);

module.exports = {
  productRouter: router,
};
