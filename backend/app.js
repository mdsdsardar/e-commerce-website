const express = require("express");
const path = require("path");
const productRouter = require("./routes/product");
const { errorMiddleware } = require("./middlewares/errors");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const orderRouter = require("./routes/order");
const app = express();
const fileUpload = require("express-fileupload");
const paymentRouter = require("./routes/payment");
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");
app.use(cookieParser());
app.use(fileUpload());

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

app.use(errorMiddleware);

module.exports = app;
