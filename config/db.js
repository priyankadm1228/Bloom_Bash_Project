const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDB is connected");
  } catch (err) {
    console.error("mongoDB is not connected", err);
    process.exit(1);
  }
};

module.exports = connectDB;
