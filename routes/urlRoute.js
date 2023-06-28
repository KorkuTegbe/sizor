const router = require("express").Router();
const { addUrl, createCustomUrl } = require("../controllers/urlController");
const { authorize } = require("../middleware/authenticate");

router.post("/", authorize, addUrl);
router.post("/custom", authorize, createCustomUrl);

module.exports = router;
