const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.ObjectId;
const urlSchema = mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickOrigin: {
    type: Array,
  },
  shortUrlImage: {
    type: String,
  },
  userId: {
    type: ObjectId,
    ref: "user",
  },
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Url", urlSchema);
