const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("File service MongoDB connected successfully");
  } catch (error) {
    console.error(
      "File service MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;