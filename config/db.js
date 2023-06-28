require("dotenv").config();
const mongoose = require("mongoose");

const LOCAL_DB = process.env.LOCAL_DB;
const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI;

exports.connectDB = async () => {
  try {
    await mongoose.connect(LOCAL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to DB ...`);
  } catch (err) {
    console.error("Error connecting to DB");
    console.log(err.message);
    process.exit(1);
  }
};

// module.exports = connectDB
