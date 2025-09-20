const router = require("express").Router();

const {
  signup_sendotp,
  signup_verifyotp,
  login_sendotp,
  login_verifyotp,
} = require("../controllers/authcontrollers");

// SIGNUP
router.post("/signup/sendotp", signup_sendotp);
router.post("/signup/verifyotp", signup_verifyotp);

// LOGIN
router.post("/login/sendotp", login_sendotp);
router.post("/login/verifyotp", login_verifyotp);

module.exports = router;