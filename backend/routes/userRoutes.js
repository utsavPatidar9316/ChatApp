const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/updateUser").put(updateUser);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;
