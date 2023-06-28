require("dotenv").config();
require("express-async-errors");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const logger = require("../utils/logger");
const { generateToken } = require("../utils/genToken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: `User already exists`,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // generateToken(res, user._id);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: "success",
        message: "User sign up successful",
      });
    } else {
      return res.status(400).json({
        status: "error",
        error: `Invalid user data`,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: `Something went very wrong` });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const comparePasswords = await bcrypt.compare(password, user.password);

    if (user && (await comparePasswords)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ status: "success", message: "User logged in" });
    } else {
      res.status(400);
      throw new appError("Invalid email or password", 400);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: `An error occured: ${err.message}` });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: `User logged out` });
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
