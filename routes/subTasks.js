const express = require("express");
const auth = require("../auth/auth");
const { updateIsDone } = require("../controllers/subTaskController");
const router = express.Router();

router.use(auth.verifyToken);

router.put("/:subTaskId", updateIsDone);

module.exports = router;
