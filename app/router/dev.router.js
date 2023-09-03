const { Router } = require("express");
const { hashPassword } = require("../utils/functions");
const router = Router();
const { randomNumber } = require("../utils/functions");

router.get("/random-number", (req, res, next) => {
  const number = randomNumber();
  if (!number) {
    return res.status(500).json({
      status: 500,
      message: "internalServerError",
    });
  }
  return res.status(200).send(number.toString());
});

router.post("/hash-pass/:password", (req, res, next) => {
  const { password } = req.params;
  const hash = hashPassword(password);
  if (!hash) {
    return res.status(500).json({
      status: 500,
      message: "internalServerError",
    });
  }
  return res.status(200).send(hash);
});

module.exports = {
  devRouter: router,
};
