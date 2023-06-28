const User = require("../models/userModel");
const URL = require("../models/urlModel");
const appError = require("../utils/appError");
const logger = require("../utils/logger");
const Cache = require("../config/redisConfig");

exports.getShortUrlClicks = async (req, res) => {
  try {
    const { urlId, shortUrl } = req.params;
    const user = req.user;
    const url = await URL.findOne({ urlId });
    const clicks = url.clicks;

    return res.status(200).json({
      message: "success",
      clicksCount: clicks,
    });
  } catch (err) {
    logger.error(`An error occured: ${err.message}: ${err.stack}`);
  }
};

exports.getShortUrlClicksLocation = async (req, res) => {
  try {
    const { urlId, shortUrl } = req.params;
    const user = req.user;
    const url = await URL.findOne({ urlId });
    const locations = url.clickOrigin;

    return res.status(200).json({
      message: "success",
      locations,
    });
  } catch (err) {
    logger.error(`An error occured: ${err.message}: ${err.stack}`);
  }
};

exports.getTotalShortenedUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const userUrls = await URL.find({ userId: userId }).select(
      "-_id -urlId -clicks -clickOrigin -date -__v -userId"
    );

    return res.status(200).json({
      status: "success",
      result: userUrls.length,
      userUrls,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: `An error occured: ${err.message}`,
    });
  }
};

exports.getTotalQrCodes = async (req, res) => {
  try {
    const userId = req.user.id;
    const allShortUrls = await URL.find({ userId: userId }).select(
      "-_id -urlId -clicks -clickOrigin -originalUrl -shortUrl -date -__v -userId"
    );
    // const qrCodes = allShortUrls.shortUrlImage;
    return res.status(200).json({
      status: "success",
      result: allShortUrls,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `An error occured: ${err.message}`,
    });
  }
};
