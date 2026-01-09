const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");
const orderRouter = require("./routes/order.route");
const paymentRouter = require("./routes/payment.route");
const { errorMiddleware, notFoundMiddleware } = require("./middlewares/errors");

const app = express(); //initilize express for routing.
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" })); //pass incoming JSON data.
app.use(express.urlencoded({ extended: true })); //parse html form into JS objects.
app.set("query parser", "extended"); //Controls how URL query strings {gte & lte} are parsed.
app.use(cookieParser()); //Stored cookie is req.cookie
app.use(fileUpload()); //media upload, now multer is better

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);

app.use("/api", notFoundMiddleware);
app.use(errorMiddleware);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

module.exports = app;
