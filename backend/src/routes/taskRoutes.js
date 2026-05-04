const express = require("express");
const {
  getUserTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getUserTasks)
  .post(createTask);

router.route("/:id")
  .get(getSingleTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
