const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    columns: [{ type: Schema.Types.ObjectId, ref: "Column" }],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
