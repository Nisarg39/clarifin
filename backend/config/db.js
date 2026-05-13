const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined in .env");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB connected — ${MONGODB_URL}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
