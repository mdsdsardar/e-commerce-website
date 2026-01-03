// const dotenv = require("dotenv");
// dotenv.config({ path: "backend/config/config.env" });
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/payment");
const { errorMiddleware } = require("./middlewares/errors");

const app = express(); //initilize express for routing.
app.use(morgan("dev")); //useful for console level error debugging.
app.use(express.json({ limit: "10kb" })); //pass incoming JSON data.
app.use(express.urlencoded({ extended: true })); //parse html form into JS objects.
app.set("query parser", "extended"); //Controls how URL query strings {gte & lte} are parsed.
app.use(cookieParser()); //Stored cookie is req.cookie
app.use(fileUpload()); //media upload, now multer is better

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
