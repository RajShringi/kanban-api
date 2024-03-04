const express = require("express");
const Board = require("../models/Board");
const router = express.Router();

// create board
router.post("/", async (req, res, next) => {
  try {
    const board = await Board.create(req.body.board);
    res.status(200).json({ board });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
