const logger = require("../utils/logger");
const appError = require("../utils/appError");
const IP = require("ip");
const axios = require("axios");

const getLocation = async (req, res, next) => {
  try {
    // const reqIpAddress = IP.address()
    const reqIpAddress = "102.176.65.255";

    const apiResponse = await axios.get(
      `https://ipapi.co/${reqIpAddress}/json/`
    );

    const location = apiResponse.data.country;

    req.location = location;

    next();
  } catch (err) {
    logger.info(err.message);
    return new appError(`An error occured: ${err.message}`, 500);
  }
};

module.exports = { getLocation };
