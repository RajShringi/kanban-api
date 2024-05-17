const User = require("../models/User");

async function userRegister(req, res, next) {
  const { username, email, password, name } = req.body.user;
  try {
    if (!email || !password || !username || !name) {
      return res.status(400).json({ errMsg: "All Fields are Required" });
    }
    const findUserByEmail = await User.findOne({ email });
    if (findUserByEmail) {
      return res
        .status(400)
        .json({ errMsg: "User with this email already exist" });
    }
    const findUserByUsername = await User.findOne({ username });
    if (findUserByUsername) {
      return res
        .status(400)
        .json({ errMsg: "User with this username already exist" });
    }
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
