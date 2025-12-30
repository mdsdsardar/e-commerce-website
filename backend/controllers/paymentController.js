const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
const { catchAsyncError } = require("../middlewares/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process Stripe Payments => /api/v1/payment/process.
exports.processPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: { integration_check: "accept_a_payment" },
  });
  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

// Process Stripe Payments => /api/v1/stipeapi
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
