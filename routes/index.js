const express = require("express");
const User = require("../models/User");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ msg: "This is home page" });
});

// user register route
router.post("/singup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await user.generateToken();
    res.status(200).json(user.userInfo(token));
  } catch (error) {
    next(error);
  }
});

// User Login route
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ errMsg: "email/passwrod required" });
  }
  try {
    const user = await User.findOne({ email });
    // if user not in database
    if (!user) {
      return res.status(400).json({ errMsg: "User not found" });
    }
    const result = await user.verifyPassword(password);
    // password is incorrect
    if (!result) {
      return res.status(400).json({ errMsg: "password is incorrect" });
    }
    const token = await user.generateToken();
    res.status(200).json(user.userInfo(token));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
