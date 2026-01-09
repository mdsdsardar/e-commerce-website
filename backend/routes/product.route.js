const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const productRouter = express.Router();

productRouter
  .route("/product/new")
  .post(isAuthenticatedUser, authorizedRole("admin"), newProduct);
productRouter.route("/admin/products").get(getAdminProducts); //need to add isAuthenticatedUser, authorizedRole("admin") laters
productRouter.route("/products").get(getProducts); //need to add it later {isAuthenticatedUser}
productRouter.route("/product/:id").get(getSingleProduct);
productRouter
  .route("/product/update/:id")
  .put(isAuthenticatedUser, authorizedRole("admin"), updateProduct);
productRouter
  .route("/product/delete/:id")
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteProduct);
productRouter.route("/review").put(isAuthenticatedUser, createProductReview);
productRouter.route("/review").get(isAuthenticatedUser, getProductReviews);
productRouter.route("/review").delete(isAuthenticatedUser, deleteReview);

module.exports = productRouter;
