const { Router } = require("express");
const { authValidator } = require("../../http/validators/user/auth.validator");
const AuthController = require("../../http/controllers/user/auth.controller");
const { validationMapper } = require("../../http/validators/validationMapper");
const { isUserPermitted } = require("../../http/middlewares/isUserPermitted");
const { verifyRefreshToken } = require("../../http/middlewares/refreshToken");
const router = Router();

router.post("/otp", authValidator(), validationMapper, AuthController.getOTP);
router.post(
  "/login",
  authValidator(),
  validationMapper,
  AuthController.validateOTP
);

router.post(
  "/refresh-token",
  verifyRefreshToken,
  validationMapper,
  AuthController.refreshToken
);

module.exports = {
  authRouter: router,
};
