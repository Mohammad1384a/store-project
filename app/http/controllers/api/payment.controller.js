const { default: axios } = require("axios");
const {
  calculateItemsPrice,
} = require("../../../graphql/resolvers/basket.resolver");
const createError = require("http-errors");
const { paymentModel } = require("../../../models/payment.model");
const { randomNumber } = require("../../../utils/functions");
const Controller = require("../controller");
const moment = require("moment-jalali");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { userModel } = require("../../../models/user.model");

class PaymentController extends Controller {
  async paymentGateway(req, res, next) {
    try {
      const user = req.user;
      if (user.basket.courses.length == 0 && user.basket.products.length == 0)
        return next(createError.BadRequest("you'r basket is empty"));
      const productsPrice = calculateItemsPrice(user.basket?.products);
      const coursesPrice = calculateItemsPrice(user.basket?.courses);
      const totalPrice = Math.floor(productsPrice + coursesPrice) || 0;
      if (!totalPrice || totalPrice === 0) {
        return next(createError.BadRequest("not found payment detail"));
      }
      const zapripal_options = {
        merchant_id: process.env.ZARINPAL_MERCHANTID,
        amount: totalPrice,
        description,
        metadata: {
          email: user?.email || "example@domain.com",
          mobile: user?.mobile,
        },
        callback_url: "http://localhost:3000/payment/verify",
      };
      const RequestResult = await axios
        .post(process.env.ZARINPAL_URL, zapripal_options)
        .then((result) => result.data);
      const { authority, code } = RequestResult?.data;
      await paymentModel.create({
        invoiceNumber: randomNumber(),
        paymentDate: moment().format("jYYYYjMMjDDHHmmss"),
        amount: totalPrice,
        user: user._id,
        description: "for buying products or courses",
        authority,
        verify: false,
        basket: user.basket,
      });
      if (code == 100 && authority) {
        return res.status(200).json({
          status: 200,
          data: {
            code,
            basket: user.basket,
            gatewayURL: `${process.env.ZARINPAL_GATEWAY}/${authority}`,
          },
        });
      }
      return next(createError.BadRequest("failed to connect payment gateway"));
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async verifyPayment(req, res, next) {
    try {
      const { Authority: authority } = req.query;
      const payment = await paymentModel.findOne({ authority });
      if (!payment) {
        return next(createError.NotFound("not found payment"));
      }
      if (payment?.verify) {
        return next(createError.BadRequest("payment already done"));
      }
      const verifyBody = JSON.stringify({
        authority,
        amount: payment.amount,
        merchant_id: process.env.ZARINPAL_MERCHANTID,
      });
      const verifyResult = await fetch(process.env.ZARINPAL_VERIFY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: verifyBody,
      }).then((result) => result.json());
      if (verifyResult.data.code == 100) {
        await paymentModel.updateOne(
          { authority },
          {
            $set: {
              refID: verifyResult?.data?.ref_id,
              cardHash: verifyResult?.data?.card_hash,
              verify: true,
            },
          }
        );
        const user = await userModel.findById(payment.user);
        await userModel.updateOne(
          { _id: payment.user },
          {
            $set: {
              Courses: [
                ...(payment?.basket?.payDetail?.courseIds || []),
                ...user.courses,
              ],
              Products: [
                ...(payment?.basket?.payDetail?.productIds || []),
                ...user.products,
              ],
              basket: {
                courses: [],
                products: [],
              },
            },
          }
        );
        return res.status(200).json({
          status: 200,
          message: "payment successful",
        });
      }
      return next(
        createError.BadRequest(
          "payment failed money will be refunded within 72 hours"
        )
      );
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
}
module.exports = {
  PaymentController: new PaymentController(),
};
