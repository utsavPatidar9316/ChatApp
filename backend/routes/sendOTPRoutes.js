const express = require("express");
const sendOTP = require("../controllers/sentOTPcontroller");

const router = express.Router();

router.route("/sendOTP").post(sendOTP);

module.exports = router;
