const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const updateUser = asyncHandler(async (req, resp) => {
  const { _id, ...updateData } = req.body; // Destructure _id and get other fields as updateData

  // Use findByIdAndUpdate with correct syntax
  const data = await User.findByIdAndUpdate(
    _id,
    updateData,
    { new: true } // Pass options as an object
  );

  resp.json({
    _id: data._id,
    name: data.name,
    email: data.email,
    isAdmin: data.isAdmin,
    pic: data.pic,
    token: generateToken(data._id),
  }); // Assuming you want to send the updated data as a JSON response
});

const lastSeen = async (id, isActive) => {
  try {
    if (isActive) {
      await User.findByIdAndUpdate(id, { isActive: true });
    } else {
      await User.findByIdAndUpdate(id, {
        isActive: false,
        lastSeen: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

module.exports = { allUsers, registerUser, authUser, updateUser, lastSeen };
