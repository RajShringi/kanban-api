const express = require("express");
const Column = require("../models/Column");
const Board = require("../models/Board");
const auth = require("../auth/auth");
const router = express.Router();

router.use(auth.verifyToken);

//create column
router.post("/:boardId", async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const columnData = { ...req.body.column, board: boardId };

    const column = await Column.create(columnData);
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $addToSet: { columns: column._id } },
      { new: true }
    );
    res.status(200).json({ column });
  } catch (error) {
    next(error);
  }
});

// get columns
router.get("/:boardId", async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId, "columns", {
      _id: 0,
    });

    const boardWithColumnsPopulate = await board.populate(
      "columns",
      "id name tasks"
    );
    res.status(200).json({ columns: boardWithColumnsPopulate.columns });
  } catch (error) {
    next(error);
  }
});

//delete Column
router.delete("/:columnId", async (req, res, next) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.columnId);
    const board = await Board.findByIdAndUpdate(
      column.board,
      { $pull: { columns: req.params.columnId } },
      { new: true }
    );
    res.status(200).json({ board });
  } catch (error) {
    next(error);
  }
});

//update column
router.put("/:columnId", async (req, res, next) => {
  try {
    const column = await Column.findByIdAndUpdate(
      req.params.columnId,
      {
        name: req.body.column.name,
      },
      { new: true }
    );
    res.status(200).json({ column });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
