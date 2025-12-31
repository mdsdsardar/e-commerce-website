const dotenv = require("dotenv");
const products = require("../data/products");
const connectToDatabase = require("../config/database");
const product = require("../model/product");

dotenv.config({ path: "backend/config/config.env" });
connectToDatabase();
const seedProducts = async () => {
  try {
    await product.deleteMany();
    console.log("Products are deleted");
    await product.insertMany(products);
    console.log("Products are added");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();

//"seeder": "node backend/utils/seeder.js" [in package.json]
//this is for feeding bulk data to our backend for testing purpose.
//seeder.js and data folder are part of this practise.