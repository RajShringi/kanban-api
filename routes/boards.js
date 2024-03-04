const express = require("express");
const Board = require("../models/Board");
const router = express.Router();
const auth = require("../auth/auth");
const User = require("../models/User");

// check user athentication
router.use(auth.verifyToken);

// create board
router.post("/", async (req, res, next) => {
  try {
    const board = await Board.create(req.body.board);
    //add this newly created board in user boards array
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { boards: board.id } },
      { new: true }
    );
    res.status(200).json({ board });
  } catch (error) {
    next(error);
  }
});

// get user boards
router.get("/", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userWithPopulateBoards = await user.populate("boards");
    res.status(200).json({ userWithPopulateBoards });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
