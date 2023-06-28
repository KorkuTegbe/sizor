require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const Cache = require("./config/redisConfig");

const PORT = process.env.PORT;

// CONFIGURE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🔥 Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// CONNECT TO DATABASE
connectDB();

Cache.connect();

const server = app.listen(PORT, () => {
  console.log(`Server started...`);
});

// CONFIGURE UNCAUGHT REJECTIONS
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🔥 Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
