require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");
const { initDatabase } = require("./src/db/fileDb");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

initDatabase();

app.use(cors({
  origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    app: "TaskFlow Full Working Backend",
    status: "online",
    frontend: CLIENT_URL,
    backend: `http://localhost:${PORT}`,
    endpoints: {
      health: "/api/health",
      register: "/api/auth/register",
      login: "/api/auth/login",
      profile: "/api/auth/me",
      tasks: "/api/tasks",
      dashboard: "/api/dashboard/stats"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Backend is connected successfully",
    time: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`TaskFlow backend running`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Frontend allowed: ${CLIENT_URL}`);
  console.log("=================================");
});
