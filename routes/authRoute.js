const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

// AUTHENTICATION ROUTES
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
