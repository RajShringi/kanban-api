const User = require("../models/User");

async function userRegister(req, res, next) {
  try {
    const user = await User.create(req.body.user);
    const token = await user.generateToken();
    res.status(200).json(user.userInfo(token));
  } catch (error) {
    next(error);
  }
}

async function userLogin(req, res, next) {
  const { email, password } = req.body.user;
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
}

module.exports = {
  userRegister,
  userLogin,
};
