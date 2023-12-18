"use strict";
const nodemailer = require("nodemailer");
const OTP = require("../template/sendOTP");
require("dotenv").config();

const sendOTP = async (req, res) => {
  const { name, email, otp } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: String(process.env.EMAIL_HOST),
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_FOR_SENT_OTP,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const emailAvatar = "";
    await transporter.sendMail({
      from: `"ChatApp"<${process.env.EMAIL_FOR_SENT_OTP}>`,
      to: email,
      subject: "OTP from ChatApp",
      html: OTP(name, otp),
    });

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

module.exports = sendOTP;
