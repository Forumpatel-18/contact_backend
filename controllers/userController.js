const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //   console.log(username, email, password);
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All feilds are mandatory");
  }

  const userAvailable = await userModel.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //hash pass
  const hashPassword = await bcrypt.hash(password, 10);
  //   console.log("hashedPassword", hashPassword);
  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
  });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await userModel.findOne({ email });
  // compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
  res.json({ message: "Login user" });
});

const currentUser = asyncHandler(async (req, res) => {
  console.log("currentuser");
  res.json(req.user);
});

module.exports = { registerUser, LoginUser, currentUser };
