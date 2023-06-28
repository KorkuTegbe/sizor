const router = require("express").Router();
const { urlRedirect } = require("../controllers/urlController");
const { getLocation } = require("../middleware/getLocation");

router.get("/:urlId", getLocation, urlRedirect); //
// router.get('/', customUrlRedirect)

module.exports = router;
