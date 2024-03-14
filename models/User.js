const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.password || this.isModified("password")) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
    }
  } catch (error) {
    return error;
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.generateToken = async function () {
  const payload = { name: this.name, id: this.id };
  try {
    const token = await jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userInfo = function (token) {
  return {
    name: this.name,
    email: this.email,
    token,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
