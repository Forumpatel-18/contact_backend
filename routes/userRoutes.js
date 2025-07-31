const express = require("express");
const {
  registerUser,
  LoginUser,
  currentUser,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", LoginUser);

router.get("/current", currentUser);

module.exports = router;
