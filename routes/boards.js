const express = require("express");
const Board = require("../models/Board");
const Column = require("../models/Column");
const router = express.Router();
const auth = require("../auth/auth");

// check user athentication
router.use(auth.verifyToken);

// Create Board
router.post("/", async (req, res, next) => {
  const boardData = {
    name: req.body.board.name,
    user: req.user.id,
    columns: [],
  };

  try {
    const board = await Board.create(boardData);
    async function createColumns(board) {
      for (const column of req.body.board.columns) {
        const columnData = {
          name: column,
          board: board.id,
          tasks: [],
        };
        const createdColumn = await Column.create(columnData);
        await Board.findByIdAndUpdate(
          board.id,
          { $push: { columns: createdColumn.id } },
          { new: true }
        );
      }
      return await Board.findById(board.id);
    }

    // Call the function with the board object
    const updatedBoard = await createColumns(board);
    res.status(200).json({ updatedBoard });
  } catch (error) {
    next(error);
  }
});

router.put("/:boardId", async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json("board Not Found");
    }
    board.name = req.body.board.name;
    const updateColumns = async () => {
      for (const column of req.body.board.columns) {
        try {
          if (column.action === "add") {
            const newColumn = await Column.create({
              name: column.name,
              board: boardId,
              tasks: [],
            });
            board.columns.push(newColumn.id);
          }

          if (column.action === "delete") {
            const deletedColumn = await Column.findByIdAndDelete(column.id);
            const index = board.columns.indexOf(deletedColumn.id);
            board.columns.splice(index, 1);
          }

          if (column.action === "update") {
            const updatedColumn = await Column.findByIdAndUpdate(column.id, {
              name: column.name,
            });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ errMsg: `Error updating column ${column.id}` });
        }
      }
      await board.save();
      return board;
    };

    const updatedBoard = await updateColumns();
    res.status(200).json({ updatedBoard });
  } catch (error) {
    next(error);
  }
});

// Get Board
router.get("/:boardId", async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json({ msg: "board Not Found" });
    }
    res.status(200).json({ board });
  } catch (error) {
    next(error);
  }
});

//Delete Board
router.delete("/:boardId", async (req, res, next) => {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findByIdAndDelete(boardId);
    if (!board) {
      return res.status(400).json({ msg: "board Not Found" });
    }
    await Column.deleteMany({ board: boardId });
    res.status(200).json({ msg: "board deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
