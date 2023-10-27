const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const redis = require("./redis");

function randomNumber() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function generateToken(payload) {
  return jwt.sign({ payload }, process.env.SECRET_KEY, {
    algorithm: "HS512",
    // expiresIn: "7d",
    expiresIn: "7d",
  });
}
async function writeRedis(id, value) {
  await redis.connect(6379);
  const expire = 365 * 24 * 60 * 60;
  const result = await redis.setEx(id, parseInt(expire), value);
  await redis.quit(() => {
    console.log("redis closed");
  });
  return !!result;
}

async function generateRefreshToken(payload, key) {
  const refreshToken = jwt.sign({ payload }, process.env.REFRESH_SECRET, {
    algorithm: "HS512",
    expiresIn: Math.floor(60 * 60 * 24 * 20),
  });
  // const result = await writeRedis(key, refreshToken);
  // if (!result) {
  //   throw createError.InternalServerError("saving refresh token failed");
  // }
  return refreshToken;
}

async function getRedis(id) {
  await redis.connect(6379);
  const result = await redis.get(id, (err, value) => {
    if (err) {
      console.log(err, value);
      createError.InternalServerError("error while getting" + err);
    }
  });
  if (!result) {
    throw createError.InternalServerError("fetching refresh token failed");
  }
  redis.quit(() => {
    console.log("redis disconnected");
  });
  return result;
}

function hashPassword(pass) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pass, salt);
  return hash.toString();
}

module.exports = {
  generateRefreshToken,
  hashPassword,
  randomNumber,
  generateToken,
  getRedis,
};
