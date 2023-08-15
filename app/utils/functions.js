const jwt = require("jsonwebtoken");
const createError = require("http-errors");

function randomNumber() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function generateToken(payload) {
  return jwt.sign({ payload }, process.env.SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: "1h",
  });
}

module.exports = {
  randomNumber,
  generateToken,
};
