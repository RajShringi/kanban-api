const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    subTasks: [{ type: Schema.Types.ObjectId, ref: "Subtask" }],
    column: { type: Schema.Types.ObjectId, ref: "Column", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
