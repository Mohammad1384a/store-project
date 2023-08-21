const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const redis = require("./redis");

function randomNumber() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function generateToken(payload) {
  return jwt.sign({ payload }, process.env.SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: "1h",
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
    expiresIn: "30d",
  });
  const result = await writeRedis(key, refreshToken);
  if (!result) {
    throw createError.InternalServerError("saving refresh token failed");
  }
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

module.exports = {
  generateRefreshToken,
  randomNumber,
  generateToken,
  getRedis,
};
