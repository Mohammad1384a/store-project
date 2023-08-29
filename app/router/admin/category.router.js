const { Router } = require("express");
const router = Router();

router.get("/hello", (req, res, next) => {
  return res.send("hello");
});

module.exports = {
  categoryRouter: router,
};
