const express = require("express");
const { userRegister, userLogin } = require("../controllers/userController");
const router = express.Router();

// user register route
router.post("/signup", userRegister);

// User Login route
router.post("/login", userLogin);

module.exports = router;
