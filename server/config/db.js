const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error("Make sure MongoDB is installed and running on your machine.");
    console.error("Current MONGO_URI:", process.env.MONGO_URI);
    console.error("Details:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
