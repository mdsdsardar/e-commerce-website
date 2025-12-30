const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://localhost:27017/shopIT"
    );
    console.log("DB Connected Successfully.");
  } catch (error) {
    console.log("DB Connection Failed:", error.message); //we need to close the server here.
  }
};

module.exports = connectToDatabase;
