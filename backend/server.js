const app = require("./app");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/database");
const cloudinary = require("cloudinary");

dotenv.config({ path: "backend/config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Uncaught Exceptions");
  process.exit(1);
});

connectToDatabase();

//Set-up Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
