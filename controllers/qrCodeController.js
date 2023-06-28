const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");
const dataUriToBuffer = require("data-uri-to-buffer");
const { uploadToCloudinary } = require("../utils/cloudinaryFunctions");
const logger = require("../utils/logger");
const appError = require("../utils/appError");
const URL = require("../models/urlModel");

const qrImages_destination = "qrImages/";

if (!fs.existsSync(qrImages_destination)) {
  fs.mkdirSync("qrImages/");
}

exports.generateQRCode = async (req, res) => {
  try {
    const { urlId } = req.params;
    // find record with urlId
    const url = await URL.findOne({ urlId });

    const textToGenerateCodeFor = url.shortUrl;

    // generate qr code
    const opts = {
      errorCorrectionLevel: "H",
      type: "png",
      color: {
        dark: "#010599FF",
        light: "#FFBF60FF",
      },
    };

    QRCode.toDataURL(textToGenerateCodeFor, opts, async (err, data) => {
      if (err) {
        console.log(err.message);
      }
      const buffer = dataUriToBuffer.dataUriToBuffer(data);

      // if (qrImages_destination) {
      //   uploadPic = await uploadToCloudinary(qrImages_destination);

      //   url.shortUrlImage = uploadPic; //"linktoqr";

      //   url.save();
      // } else {
      //   return `an error occured`;
      // }

      res.setHeader("Content-Disposition", "attachment; filename=qr_code.png");
      res.setHeader("Content-Type", "image/png");
      res.status(200).send(buffer);
      // res.status(200).json({
      //   data: buffer,
      // });
    });
  } catch (err) {
    console.log(err.message, err.stack);
  }
};

exports.readQRCode = async (req, res) => {};
