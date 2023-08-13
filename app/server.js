const http = require("http");
const morgan = require("morgan");
const { AllRoutes } = require("../router/index.router");
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
      .connect(DB_URI)
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
      process.exit(0);
    });
  }
  createRotues() {
    this.#app.use(AllRoutes);
  }
  errorHandling() {
    this.#app.use((err, req, res, next) => {
      const status = err.status ?? err.statusCode ?? 500;
      const message = err.message ?? err.msg ?? "InternalServerError";
      return res.status(status).json({
        status,
        message,
      });
    });
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        status: 404,
        message: "not found page",
      });
    });
  }
}

module.exports = Application;
