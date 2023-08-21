const createError = require("http-errors");
const { createClient } = require("redis");
const redis = createClient();

redis.on("connect", () => {
  console.log("connecting to redis...");
});
redis.on("ready", () => {
  console.log("redis connected");
});
redis.on("error", (err) => {
  console.log(err);
  createError.InternalServerError("error in redis");
});
redis.on("end", () => {
  console.log("redis disconnected");
});

module.exports = redis;
