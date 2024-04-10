const SubTask = require("../models/SubTasks");
const Column = require("../models/Column");

async function getColumnInfo(req, res, next) {
  const { columnId } = req.params;
  try {
    const column = await Column.findById(columnId)
      .populate({
        path: "tasks",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "subTasks",
          model: SubTask,
          select: "-createdAt -updatedAt -__v",
        },
      })
      .select("-createdAt -updatedAt -__v -board");

    if (!column) {
      res.status(400).json({ error: `No column found with this ${columnId}` });
    }
    res.status(200).json({ column });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getColumnInfo,
};
