// 1️⃣ Handle uncaught exceptions FIRST
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Uncaught Exceptions");
  process.exit(1);
});

// 2️⃣ Load env
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
require("./utils/cloudinary");

// 3️⃣ App & DB
const app = require("./app");
const connectToDatabase = require("./config/database");
connectToDatabase();

// 4️⃣ Start server
app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// 5️⃣ Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
