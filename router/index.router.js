const { Router } = require("express");
const router = Router();
const HomeController = require("../http/controllers/api/home.controller");

router.get("/", HomeController.indexPage);

module.exports = {
  AllRoutes: router,
};
