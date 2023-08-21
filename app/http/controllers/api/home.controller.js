const Controller = require("../controller");

class HomeController extends Controller {
  indexPage(req, res, next) {
    try {
      return res.status(200).send("hello");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HomeController();
