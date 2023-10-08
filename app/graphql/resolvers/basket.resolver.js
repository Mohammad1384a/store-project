const { GraphQLString } = require("graphql");
const { userModel } = require("../../models/user.model");
const createError = require("http-errors");
const { responseType } = require("../types/public.types");
const {
  graphUserPermission,
} = require("../../http/middlewares/isUserPermitted");

const basketResolver = {
  type: responseType,
  resolve: async (_, args, { req, res }) => {
    const user = await graphUserPermission(req);
    const coursesInBasket = await userModel
      .findById(user._id, { "basket.courses": 1 })
      .populate("basket.courses.courseId")
      .exec();
    return {
      status: 200,
      data: coursesInBasket,
    };
  },
};

function priceReducer(item) {
  if (!item || item?.length === 0) return 0;
  let total = 0;
  item?.reduce((acc, cur) => {
    return (total += Math.floor((acc?.price || 0) + (cur?.price || 0)));
  });
  return total;
}

function getAllPrices({ courses, products }) {
  if (!courses?.length && !products?.lenght) {
    return 0;
  }
  const totalCoursesPrice = priceReducer(courses);
  const totalProductsPrice = priceReducer(products);
  return Math.floor(totalCoursesPrice + totalProductsPrice);
}

function calculateItemsPrice(items) {
  if (!items || items?.length === 0) {
    return 0;
  }
  if (items?.length === 1) {
    const item = items[0];
    return (
      Math.floor(
        (item.price - Math.floor(item.price * (item.discount / 100))) *
          item.count
      ) || 0
    );
  }
  let total = 0;
  return items?.reduce((accumulator, current) => {
    let acc =
      Math.floor(
        accumulator.price -
          Math.floor(accumulator.price * (accumulator.discount / 100))
      ) || 0;
    let cur =
      Math.floor(
        current.price - Math.floor(current.price * (current.discount / 100))
      ) || 0;
    acc = accumulator.count ? Math.floor(accumulator.count * acc) : acc;
    cur = cur.count ? Math.floor(cur.count * cur) : cur;
    return (total += Math.floor(acc + cur));
  });
}

const calcBasketPrice = {
  type: responseType,
  resolve: async (_, args, { req, res }) => {
    const user = await graphUserPermission(req);
    const totalPrice = getAllPrices(user.basket || []);
    const coursesPrice = calculateItemsPrice(user.basket?.courses || []);
    const productsPrice = calculateItemsPrice(user.basket?.products || []);
    const totalDiscount = Math.floor(
      totalPrice - (coursesPrice + productsPrice)
    );
    return {
      status: 200,
      data: {
        totalPrice,
        coursesPrice,
        productsPrice,
        totalDiscount,
      },
    };
  },
};

module.exports = {
  basketResolver,
  calcBasketPrice,
  calculateItemsPrice,
};
