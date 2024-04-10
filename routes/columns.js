const express = require("express");
const auth = require("../auth/auth");
const { getColumnInfo } = require("../controllers/columnController");
const router = express.Router();

router.use(auth.verifyToken);

// get columns
// router.get("/:boardId", async (req, res, next) => {
//   console.log("comes multiple");
//   try {
//     const columns = await Column.find({ board: req.params.boardId })
//       .populate({
//         path: "tasks",
//         select: "-createdAt -updatedAt -__v",
//         populate: {
//           path: "subTasks",
//           model: SubTask,
//           select: "-createdAt -updatedAt -__v",
//         },
//       })
//       .select("-createdAt -updatedAt -__v -board");

//     //may be create subtask model and populate that model also if that work
//     res.status(200).json({ columns });
//   } catch (error) {
//     next(error);
//   }
// });

//get single column
router.get("/:columnId", getColumnInfo);
module.exports = router;
