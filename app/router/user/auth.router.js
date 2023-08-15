const { Router } = require("express");
const { authValidator } = require("../../http/validators/user/auth.validator");
const AuthController = require("../../http/controllers/user/auth.controller");
const { validationMapper } = require("../../http/validators/validationMapper");
const { isUserLoggedIn } = require("../../http/middlewares/isUserLoggedIn");
const router = Router();

router.post("/otp", authValidator(), validationMapper, AuthController.getOTP);
router.post(
  "/login",
  authValidator(),
  isUserLoggedIn,
  validationMapper,
  AuthController.validateOTP
);

module.exports = {
  authRouter: router,
};
