const express = require("express");
const { userRegister, userLogin } = require("../controllers/userController");
const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.status(200).json({ msg: "Server is Running" });
});

// user register route
router.post("/signup", userRegister);

// User Login route
router.post("/login", userLogin);

module.exports = router;
