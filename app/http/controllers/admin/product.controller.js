const Controller = require("../controller");
const { productModel } = require("../../../models/product.model");
const createError = require("http-errors");

class ProductController extends Controller {
  async addProduct(req, res, next) {
    try {
      const data = req.body;
      if (req.files.length === 0 || !req.file) {
        throw createError.BadRequest(
          "you must choose 2-5 images for your product"
        );
      }
      const protocol = req.protocol;
      const host = req.get("host");
      const imagesAddress = req?.files.map((file) => {
        return (
          protocol +
          "://" +
          host +
          "/" +
          file?.path?.substring(file.path.indexOf("uploads"))
        );
      });
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
      data.images = imagesAddress;
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
  async getProductList(req, res, next) {
    try {
      const query = req.query.search;
      const products = await productModel.find(
        query ? { $text: { $search: query } } : {},
        { __v: 0, _id: 0 }
      );
      if (products.length === 0) {
        throw createError.NotFound("no products found");
      }
      return res.status(200).json({
        status: 200,
        products,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productModel.findById(id);
      if (!product) {
        throw createError.NotFound("no such a product found");
      }
      return res.status(200).json({
        status: 200,
        product,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async editProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productModel.findById(id);
      if (!product) {
        throw createError.NotFound("no such a project found");
      }
      const protocol = req.protocol;
      const host = req.get("host");
      const imagesAddress =
        req.files.length > 0
          ? req?.files.map((file) => {
              return (
                protocol +
                "://" +
                host +
                "/" +
                file?.path?.substring(file.path.indexOf("uploads"))
              );
            })
          : null;
      let data = req.body;
      data.images = imagesAddress ?? product.images;
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
          throw createError.BadRequest("invalid key sent");
        }
      });
      const update = await productModel.updateOne({ _id: id }, { $set: data });
      if (update.modifiedCount === 0) {
        throw createError.InternalServerError("updating product failed");
      }
      return res.status(200).json({
        status: 200,
        update,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
  async removeProduct(req, res, next) {
    try {
      const { id } = req.params;
      const remove = await productModel.deleteOne({ _id: id });
      if (remove.deletedCount === 0) {
        throw createError.InternalServerError("deleting product failed");
      }
      return res.status(200).json({
        status: 200,
        remove,
      });
    } catch (error) {
      next(createError.InternalServerError(error?.message ?? error));
    }
  }
}

module.exports = new ProductController();
