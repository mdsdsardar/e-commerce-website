const { catchAsyncError } = require("../middlewares/catchAsyncErrors");
const Order = require("../model/order");
const Product = require("../model/product");
const ErrorHandler = require("../utils/errorHandler");

//create new order => /api/v1/order/now
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;
  // Validate and deduct stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new ErrorHandler(`Product not found`, 404));
    }

    if (product.stock < item.quantity) {
      return next(
        new ErrorHandler(
          `Insufficient stock for ${product.name}. Only ${product.stock} available`,
          400
        )
      );
    }

    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }
  res.status(201).json({
    success: true,
    order,
  });
});

//Get Logged In User order => /api/v1/order/me
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  // if (!orders) {
  //   return next(new ErrorHandler(" Order Not found ", 404));
  // }
  res.status(201).json({
    success: true,
    orders,
  });
});

//Get all the orders (Admin only) => /api/v1/admin/orders/
exports.allOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(201).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Total amount is incorrect, It'll be checked in frontend.
//Update order (admin only) => /api/v1/admin/order/:id
exports.updateOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  // order.orderItems.forEach(async (item) => {
  //   await updateStock(item.product, item.quantity);
  // });
  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(201).json({
    success: true,
    order,
  });
});

// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);
//   product.stock = product.stock - quantity;
//   await product.save({ validateBeforeSave: false });
// }

//Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }
  res.status(201).json({
    success: true,
  });
});
