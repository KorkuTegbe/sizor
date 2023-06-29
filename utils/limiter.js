const limiter = require("express-rate-limit");

const rateLimiter = limiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests. Try again in 10 minutes",
});

module.exports = rateLimiter;
