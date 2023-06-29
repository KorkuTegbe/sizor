require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const appError = require("./utils/appError");
const logger = require("./utils/logger");
const rateLimiter = require("./utils/limiter");
const morganMiddleWare = require("./utils/morgan");
const globalErrorHandler = require("./controllers/errorController");

const urlRoute = require("./routes/urlRoute");
const redirectRoute = require("./routes/redirectRoute");
const qrCodeRoute = require("./routes/qrCodeRoute");
const authRoute = require("./routes/authRoute");
const analyticsRoute = require("./routes/analyticsRoute");

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganMiddleWare);
app.use(rateLimiter);

app.use("/api/v1/short", urlRoute);
app.use("/", redirectRoute);
app.use("/api/v1/qr", qrCodeRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/analytics", analyticsRoute);

// change req time format
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: `Welcome to the scissor API` });
});

// handle unknown request errs
app.all("*", (req, res, next) => {
  return new appError(`${req.originalUrl} not found on server`, 404);
});

app.use(globalErrorHandler);

module.exports = app;
