require("dotenv").config();
const shortid = require("shortid");
const URL = require("../models/urlModel");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const logger = require("../utils/logger");
const { isValidUrl } = require("../utils/validateUrl");
const Cache = require("../config/redisConfig");

exports.addUrl = async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL;
    const { originalUrl } = req.body;

    // check if url is valid
    if (isValidUrl(originalUrl)) {
      // check of url already exists in db
      const oldUrl = await URL.findOne({ originalUrl, userId: req.user._id });
      if (!oldUrl) {
        const urlId = shortid.generate();
        const shortUrl = `${baseUrl}/${urlId}`;

        const shortened = new URL({
          urlId,
          originalUrl,
          shortUrl,
          date: Date.now(),
          userId: req.user._id,
        });

        shortened.save();

        // add shortened url to cache
        const cacheKey = shortened.urlId;
        Cache.redis.set(cacheKey, shortened.originalUrl);

        return res.status(201).json({
          status: `success`,
          shortened,
        });
      } else {
        return res.json({
          message: `Url already shortened`,
        });
      }
    } else {
      return res.json({
        message: `Invalid Url`,
      });
    }
  } catch (err) {
    logger.error(err.message);
    throw new appError(`${err.message}`, 500);
  }
};

exports.urlRedirect = async (req, res) => {
  const { urlId } = req.params;
  try {
    // check cache first
    const cachedUrl = await Cache.redis.get(urlId);

    if (cachedUrl) {
      console.log("from cached layer");
      return res.status(302).redirect(cachedUrl);
    }

    // find url with urlId
    const url = await URL.findOne({ urlId });

    // update click count and redirect
    if (url) {
      // update click count
      await URL.updateOne({ urlId: urlId }, { $inc: { clicks: 1 } });

      url.clickOrigin.push(req.location);
      await url.save();
      // redirect to original url
      return res.status(302).redirect(url.originalUrl);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    logger.error(err.message);
    throw new appError(`${err.message}`, 500);
  }
};

exports.createCustomUrl = async (req, res) => {
  try {
    const { originalUrl, customUrl } = req.body;
    const baseUrl = process.env.BASE_URL;
    // 1. check if originalUrl format is correct
    const isValidOriginalUrl = await isValidUrl(originalUrl);
    // const isValidCustomUrl = await isValidUrl(customUrl)
    if (isValidOriginalUrl) {
      // && isValidCustomUrl
      const oldUrl = await URL.findOne({ originalUrl, userId: req.user._id });
      if (!oldUrl) {
        const urlId = customUrl; //shortid.generate();
        const shortUrl = `${baseUrl}/${urlId}`;

        const shortened = new URL({
          urlId,
          originalUrl,
          shortUrl,
          date: Date.now(),
          userId: req.user._id,
        });

        shortened.save();

        return res.status(201).json({
          status: `success`,
          shortened,
        });
      } else {
        return res.json({
          message: `Url already shortened`,
        });
      }
    } else {
      return res.status(400).json({ message: "Please enter valid urls" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: `An error occured: ${err.message}` });
  }
};
