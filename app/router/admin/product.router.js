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

router.post(
  "/add",
  uploadFile.array("images", 5),
  productValidator(),
  validationMapper,
  ProductController.addProduct
);

router.get("/all", ProductController.getProductList);

router.get(
  "/:id",
  validateId(),
  validationMapper,
  ProductController.getProductById
);

router.delete(
  "/:id",
  validateId(),
  validationMapper,
  ProductController.removeProduct
);

router.put(
  "/edit/:id",
  validateId(),
  updateProductValidator(),
  validationMapper,
  uploadFile.array("images", 5),
  ProductController.editProduct
);

router.get(
  "/myproducts/:id",
  validateId(),
  validationMapper,
  ProductController.getVendorProducts
);

module.exports = {
  productRouter: router,
};
