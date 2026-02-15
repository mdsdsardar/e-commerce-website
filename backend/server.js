// 1️⃣ Handle uncaught exceptions FIRST
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Uncaught Exceptions");
  process.exit(1);
});

// 2️⃣ Load env
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
require("./config/cloudinary");

// 3️⃣ App & DB
const app = require("./app");
require("./config/database");

// 4️⃣ Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on PORT: ${PORT} in ${process.env.NODE_ENV} mode`
  );
});

// 5️⃣ Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
