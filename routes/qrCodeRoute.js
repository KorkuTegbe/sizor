const router = require("express").Router();
const { generateQRCode } = require("../controllers/qrCodeController");
const { authorize } = require("../middleware/authenticate");

router.post("/generate/:urlId", authorize, generateQRCode);

module.exports = router;
