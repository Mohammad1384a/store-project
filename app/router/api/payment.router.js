const {
  PaymentController,
} = require("../../http/controllers/api/payment.controller");
const { isUserPermitted } = require("../../http/middlewares/isUserPermitted");

const router = require("express").Router();
router.post("/", isUserPermitted(["USER"]), PaymentController.paymentGateway);
router.get("/verify", PaymentController.verifyPayment);
module.exports = {
  paymentRouter: router,
};
