require("dotenv").config();
const Redis = require("redis");

const REDIS_URL = process.env.REDIS_URL;

class Cache {
  constructor() {
    this.redis = null;
  }

  async connect() {
    try {
      this.redis = await Redis.createClient({
        url: REDIS_URL,
      });

      this.redis.connect();

      this.redis.on("connect", () => {
        console.log("Redis connected...");
      });

      this.redis.on("error", (err) => {
        console.log("Redis connection error", err.message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const instance = new Cache();

module.exports = instance;
