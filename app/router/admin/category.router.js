const { Router } = require("express");
const router = Router();
const CategoryController = require("../../http/controllers/admin/category.controller");
const {
  categoryValidator,
} = require("../../http/validators/admin/category.validator");
const { validationMapper } = require("../../http/validators/validationMapper");

router.post(
  "/add",
  categoryValidator(),
  validationMapper,
  CategoryController.add
);

router.get("/parents", CategoryController.getParents);

router.get(
  "/children/:parent",
  categoryValidator(),
  validationMapper,
  CategoryController.getChildrensParent
);

router.get("/all", CategoryController.getAllCategories);

router.get(
  "/:id",
  categoryValidator(),
  validationMapper,
  CategoryController.getbyId
);

router.delete(
  "/:id",
  categoryValidator(),
  validationMapper,
  CategoryController.removeById
);

router.put(
  "/edit/:id",
  categoryValidator(),
  validationMapper,
  CategoryController.edit
);

module.exports = {
  categoryRouter: router,
};
