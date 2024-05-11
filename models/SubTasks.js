const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subTasksSchema = new Schema(
  {
    name: { type: String, required: true },
    isDone: { type: Boolean, default: false, require: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

const SubTask = mongoose.model("Subtask", subTasksSchema);

module.exports = SubTask;
