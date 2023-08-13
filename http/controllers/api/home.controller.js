const Controller = require("../controller");

class HomeController extends Controller {
  indexPage(req, res, next) {
    res.status(200).send("hello");
  }
}

module.exports = new HomeController();
