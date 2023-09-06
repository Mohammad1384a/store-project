const Controller = require("../controller");
const { productModel } = require("../../../models/product.model");
const createError = require("http-errors");

class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const data = req.body;
      const validItems = [
        "title",
        "brief_text",
        "body",
        "images",
        "categories",
        "price",
        "type",
        "teacher",
        "features",
        "quentity",
        "discount",
        "tags",
        "comments",
      ];
      Object.keys(data).forEach((key) => {
        if (!validItems.includes(key)) {
          throw createError.BadRequest("invalid properties sent " + key);
        }
      });
      const product = await productModel.create(data);
      if (!product) {
        throw createError.InternalServerError("creating product failed");
      }
      return res.status(200).json({
        status: 200,
        product,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
}

module.exports = new ProductController();
