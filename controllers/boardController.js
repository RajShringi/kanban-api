const Board = require("../models/Board");
const Column = require("../models/Column");
const SubTask = require("../models/SubTasks");
const Task = require("../models/Task");

async function createBoard(req, res, next) {
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
    res.status(200).json({ board: updatedBoard });
  } catch (error) {
    next(error);
  }
}

async function updateBoard(req, res, next) {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json({ error: "board Not Found" });
    }
    console.log(req.body.board.columns, "columns");
    board.name = req.body.board.name;
    const updateColumns = async () => {
      for (const column of req.body.board.columns) {
        if (column.action === "add") {
          const newColumn = await Column.create({
            name: column.name,
            board: boardId,
            tasks: [],
          });
          board.columns.push(newColumn._id);
        }

        if (column.action === "delete") {
          const deletedColumn = await Column.findByIdAndDelete(column._id);
          if (!deletedColumn) {
            return res
              .status(400)
              .json({ error: `Column ${column._id} not found` });
          }
          // Delete associated tasks of the deleted column
          await Task.deleteMany({ column: deletedColumn._id });

          // Delete associated subtasks of the deleted tasks
          await SubTask.deleteMany({ task: { $in: deletedColumn.tasks } });

          const index = board.columns.indexOf(deletedColumn._id);
          board.columns.splice(index, 1);
        }

        if (column.action === "update") {
          const updatedColumn = await Column.findByIdAndUpdate(column._id, {
            name: column.name,
          });
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
}

async function getBoardInfo(req, res, next) {
  try {
    const boardId = req.params.boardId;
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(400).json({ error: "board Not Found" });
    }
    res.status(200).json({ board });
  } catch (error) {
    next(error);
  }
}

async function deleteBoard(req, res, next) {
  try {
    const boardId = req.params.boardId;
    // Find all columns of the board
    const columns = await Column.find({ board: boardId });

    // Extract all task IDs from the columns
    const taskIds = columns.reduce(
      (acc, column) => acc.concat(column.tasks),
      []
    );

    // Delete all subtasks associated with the tasks of the board
    await SubTask.deleteMany({ task: { $in: taskIds } });

    // Delete all tasks associated with the columns of the board
    await Task.deleteMany({
      column: { $in: columns.map((column) => column._id) },
    });

    // Delete all columns of the board
    await Column.deleteMany({ board: boardId });

    // Finally, delete the board itself
    const deletedBoard = await Board.findByIdAndDelete(boardId);

    // Return success message or any other necessary data
    return {
      message:
        "Board and associated columns, tasks, and subtasks successfully deleted",
    };
  } catch (error) {
    next(error);
  }
}

async function getAllBoards(req, res, next) {
  try {
    const boards = await Board.find({ user: req.user.id }).select(
      "id name columns"
    );
    res.status(200).json({ boards });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBoard,
  updateBoard,
  getBoardInfo,
  deleteBoard,
  getAllBoards,
};
