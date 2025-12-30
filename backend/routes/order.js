const express = require("express");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrders,
  deleteOrder,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.route("/order/new").post(isAuthenticatedUser, newOrder);
orderRouter.route("/orders/me").get(isAuthenticatedUser, myOrders);
orderRouter.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
orderRouter
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizedRole("admin"), allOrders);
orderRouter
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizedRole("admin"), updateOrders);
orderRouter
  .route("/admin/orders/:id")
  .delete(isAuthenticatedUser, authorizedRole("admin"), deleteOrder);

module.exports = orderRouter;
