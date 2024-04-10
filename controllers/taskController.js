const Task = require("../models/Task");
const SubTask = require("../models/SubTasks");
const Column = require("../models/Column");

async function createTask(req, res, next) {
  const newTask = {
    name: req.body.task.name,
    description: req.body.task.description,
    subTasks: [],
    column: req.body.task.column,
  };
  try {
    const column = await Column.findById(req.body.task.column);
    if (!column) {
      return res
        .status(400)
        .json({ error: `There is no column with ${req.body.task.column} id` });
    }
    const task = await Task.create(newTask);
    await Column.findByIdAndUpdate(
      req.body.task.column,
      { $push: { tasks: task.id } },
      { new: true }
    );
    async function createSubtask() {
      for (const subTask of req.body.task.subTasks) {
        const newSubTask = await SubTask.create({
          name: subTask,
          isDone: false,
          task: task._id,
        });
        await Task.findByIdAndUpdate(
          task.id,
          { $push: { subTasks: newSubTask._id } },
          { new: true }
        );
      }
      return await Task.findById(task.id).populate({
        path: "subTasks",
        select: "createdAt -updatedAt -__v",
      });
    }
    const updatedTask = await createSubtask();
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      res.status(400).json({ error: `No task found with this ${taskId}` });
    }
    await SubTask.deleteMany({ task: task._id });
    await Column.findByIdAndUpdate(
      task.column,
      { $pull: { tasks: task._id } },
      { new: true }
    );
    res.status(200).json({ msg: "Task deleted Successfully" });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ error: "No Such Task" });
    }
    task.name = req.body.task.name;

    async function updateTaskWithSubTasks() {
      for (const subTask of req.body.task.subTasks) {
        try {
          if (subTask.action === "add") {
            const newSubTask = await SubTask.create({
              name: subTask.name,
              isDone: false,
              task: task._id,
            });
            task.subTasks.push(newSubTask._id);
          }

          if (subTask.action === "delete") {
            const deletedSubTask = await SubTask.findByIdAndDelete(subTask.id);
            const index = task.subTasks.indexOf(deletedSubTask._id);
            task.subTasks.splice(index, 1);
          }

          if (subTask.action === "update") {
            const updateSubTask = await SubTask.findByIdAndUpdate(subTask.id, {
              name: subTask.name,
            });
          }
        } catch (error) {
          res.status(400).json({ error: "Error Updating Subtask" });
        }
      }
      await task.save();
      return task;
    }
    const updatedTask = await updateTaskWithSubTasks();
    res.status(200).json({ updatedTask });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  deleteTask,
  updateTask,
};
