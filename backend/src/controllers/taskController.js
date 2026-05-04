const { readDB, writeDB } = require("../db/fileDb");

function getUserTasks(req, res) {
  const db = readDB();
  const tasks = db.tasks
    .filter((task) => task.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json(tasks);
}

function createTask(req, res) {
  const { title, description, priority, status, dueDate } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Task title and description are required."
    });
  }

  const allowedPriorities = ["Low", "Medium", "High"];
  const allowedStatuses = ["Pending", "In Progress", "Completed"];

  const db = readDB();

  const task = {
    id: Date.now(),
    userId: req.user.id,
    title: title.trim(),
    description: description.trim(),
    priority: allowedPriorities.includes(priority) ? priority : "Medium",
    status: allowedStatuses.includes(status) ? status : "Pending",
    dueDate: dueDate || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.tasks.push(task);
  writeDB(db);

  return res.status(201).json(task);
}

function getSingleTask(req, res) {
  const db = readDB();
  const taskId = Number(req.params.id);

  const task = db.tasks.find(
    (item) => item.id === taskId && item.userId === req.user.id
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found."
    });
  }

  return res.json(task);
}

function updateTask(req, res) {
  const db = readDB();
  const taskId = Number(req.params.id);

  const taskIndex = db.tasks.findIndex(
    (task) => task.id === taskId && task.userId === req.user.id
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found."
    });
  }

  const allowedPriorities = ["Low", "Medium", "High"];
  const allowedStatuses = ["Pending", "In Progress", "Completed"];

  const oldTask = db.tasks[taskIndex];

  const updatedTask = {
    ...oldTask,
    title: req.body.title !== undefined ? req.body.title.trim() : oldTask.title,
    description:
      req.body.description !== undefined
        ? req.body.description.trim()
        : oldTask.description,
    priority: allowedPriorities.includes(req.body.priority)
      ? req.body.priority
      : oldTask.priority,
    status: allowedStatuses.includes(req.body.status)
      ? req.body.status
      : oldTask.status,
    dueDate: req.body.dueDate !== undefined ? req.body.dueDate : oldTask.dueDate,
    updatedAt: new Date().toISOString()
  };

  db.tasks[taskIndex] = updatedTask;
  writeDB(db);

  return res.json(updatedTask);
}

function deleteTask(req, res) {
  const db = readDB();
  const taskId = Number(req.params.id);

  const taskExists = db.tasks.some(
    (task) => task.id === taskId && task.userId === req.user.id
  );

  if (!taskExists) {
    return res.status(404).json({
      success: false,
      message: "Task not found."
    });
  }

  db.tasks = db.tasks.filter(
    (task) => !(task.id === taskId && task.userId === req.user.id)
  );

  writeDB(db);

  return res.json({
    success: true,
    message: "Task deleted successfully."
  });
}

function getStats(req, res) {
  const db = readDB();
  const tasks = db.tasks.filter((task) => task.userId === req.user.id);

  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "Pending").length;
  const inProgress = tasks.filter((task) => task.status === "In Progress").length;
  const completed = tasks.filter((task) => task.status === "Completed").length;
  const highPriority = tasks.filter((task) => task.priority === "High").length;

  return res.json({
    total,
    pending,
    inProgress,
    completed,
    highPriority,
    completionRate: total ? Math.round((completed / total) * 100) : 0
  });
}

module.exports = {
  getUserTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
  getStats
};
