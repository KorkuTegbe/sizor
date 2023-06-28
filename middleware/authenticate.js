require("dotenv").config();
require("express-async-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authorize = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.userId).select(
        "-password -urls -__v"
      );
      req.user = currentUser;
      next();
    } catch (error) {
      res.status(401);
      throw new appError("Not authorized, invalid token", 401);
    }
  } else {
    res.status(401);
    throw new appError("Not authorized, no token", 401);
  }
};

module.exports = { authorize };
