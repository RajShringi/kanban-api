const express = require("express");
const auth = require("../auth/auth");
const {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardInfo,
  getAllBoards,
} = require("../controllers/boardController");
const router = express.Router();

// check user athentication
router.use(auth.verifyToken);

//get all board of user
router.get("/allboards", getAllBoards);

// Create Board
router.post("/", createBoard);

//Update board
router.put("/:boardId", updateBoard);

// Get Board
router.get("/:boardId", getBoardInfo);

//Delete Board
router.delete("/:boardId", deleteBoard);

module.exports = router;
