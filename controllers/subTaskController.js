const SubTask = require("../models/SubTasks");

async function updateIsDone(req, res, next) {
  const { subTaskId } = req.params;
  try {
    const subTask = await SubTask.findByIdAndUpdate(
      subTaskId,
      {
        isDone: req.body.subTask.isDone,
      },
      { new: true }
    );
    if (!subTask) {
      res
        .status(400)
        .json({ error: `No subTask found with this ${subTaskId}` });
    }
    res.status(200).json({ subTask });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateIsDone,
};
