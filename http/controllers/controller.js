const autoBind = (...args) =>
  import("auto-bind").then(({ default: autoBind }) => autoBind(...args));

class Controller {
  constructor() {
    autoBind(this);
  }
}

module.exports = Controller;
