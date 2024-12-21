const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");
const boardsRouter = require("./routes/boards");
const columnsRouter = require("./routes/columns");
const tasksRouter = require("./routes/tasks");
const subTasksRouter = require("./routes/subTasks");

// connect to database
main().catch((err) => console.log(err ? err : "connected to database"));
async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}

const app = express();
app.use(
  cors({
    origin: "https://kanban-three-beta.vercel.app", // Replace with your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/boards", boardsRouter);
app.use("/api/columns", columnsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/subTasks", subTasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ errorMsg: err.message });
});

module.exports = app;
