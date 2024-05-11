const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const columnSchema = new Schema(
  {
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
  },
  { timestamps: true }
);

const Column = mongoose.model("Column", columnSchema);

module.exports = Column;
