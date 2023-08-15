const { validationResult } = require("express-validator");

function validationMapper(req, res, next) {
  let messages = {};
  const result = validationResult(req);
  if (result?.errors?.length > 0) {
    result.errors.forEach((e) => {
      messages[e.path] = e.msg ?? e.value;
    });
    return res.status(400).json({
      status: 400,
      messages,
    });
  }
  next();
}

module.exports = {
  validationMapper,
};
