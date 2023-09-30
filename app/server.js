const http = require("http");
const cors = require("cors");
const Error = require("http-errors");
const morgan = require("morgan");
const { AllRoutes } = require("./router/index.router");
const redis = require("./utils/redis");
const { default: mongoose } = require("mongoose");
const path = require("path");

class Application {
  #express = require("express");
  #app = this.#express();
  constructor(PORT, DB_URI) {
    this.configApplication();
    this.DBConnection(DB_URI);
    this.createServer(PORT);
    this.createRotues();
    this.errorHandling();
  }
  configApplication() {
    this.#app.use(cors());
    this.#app.use(morgan("dev"));
    this.#app.use(this.#express.json());
    this.#app.use(this.#express.urlencoded({ extended: true }));
    this.#app.use(this.#express.static(path.join(__dirname, "../public")));
  }
  createServer(PORT) {
    http.createServer(this.#app).listen(PORT, () => {
      console.log("listening on port" + PORT);
    });
  }
  DBConnection(DB_URI) {
    mongoose
      .connect(DB_URI, {
        family: 4,
      })
      .then(() => {
        console.log("DB conected Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    // mongoose.connection.on("connected", () => {
    //   console.log("I'm connected");
    // });
    // mongoose.connection.on("disconnected", () => {
    //   console.log("DB disconnected");
    // });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      redis.quit(() => {
        console.log("redis closed");
      });
      process.exit(0);
    });
  }
  createRotues() {
    this.#app.use(AllRoutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      next(Error.NotFound("not found page!"));
    });
    this.#app.use((err, req, res, next) => {
      const serverError = Error.InternalServerError();
      const status =
        err.status ??
        err.statusCode ??
        serverError.status ??
        serverError.statusCode;
      const message = err.message ?? err.msg ?? serverError.message;
      return res.status(status).json({
        status,
        message,
      });
    });
  }
}

module.exports = Application;
