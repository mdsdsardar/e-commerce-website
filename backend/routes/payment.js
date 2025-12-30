const express = require("express");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");
const {
  processPayment,
  sendStripeApi,
} = require("../controllers/paymentController");
const paymentRouter = express.Router();

paymentRouter
  .route("/payment/process")
  .post(isAuthenticatedUser, processPayment);
paymentRouter.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);

module.exports = paymentRouter;
