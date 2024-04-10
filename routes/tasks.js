const express = require("express");
const auth = require("../auth/auth");
const {
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");
const router = express.Router();

router.use(auth.verifyToken);

//create a new task with subtasks
router.post("/", createTask);

//Delete Task and subtaks
router.delete("/:taskId", deleteTask);

// update Task name and modify subtasks
router.put("/:taskId", updateTask);

module.exports = router;
