const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    name: { type: String, required: true },
    columns: [{ type: Schema.Types.ObjectId, ref: "Column" }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
