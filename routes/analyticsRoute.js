const router = require("express").Router();
const { authorize } = require("../middleware/authenticate");
const {
  getShortUrlClicks,
  getTotalShortenedUrls,
  getTotalQrCodes,
  getShortUrlClicksLocation,
} = require("../controllers/analyticsController");

router.get("/short-urls/", authorize, getTotalShortenedUrls);
router.get("/clicks/:urlId", authorize, getShortUrlClicks);
router.get("/qr", authorize, getTotalQrCodes);
router.get("/location/:urlId", authorize, getShortUrlClicksLocation);

module.exports = router;
