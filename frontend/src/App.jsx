import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("taskflowUser")) || null);
  const [token, setToken] = useState(localStorage.getItem("taskflowToken") || "");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("Checking backend...");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    checkBackend();
  }, []);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  async function checkBackend() {
    try {
      const res = await fetch(`${API_URL}/health`);
      const data = await res.json();
      setApiStatus(data.message || "Backend connected");
    } catch {
      setApiStatus("Backend not connected. Start backend server first.");
    }
  }

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3200);
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const payload = isLogin
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Authentication failed");
        return;
      }

      if (isLogin) {
        localStorage.setItem("taskflowToken", data.token);
        localStorage.setItem("taskflowUser", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        showMessage("Login successful");
      } else {
        showMessage("Account created successfully. Please login.");
        setIsLogin(true);
      }

      setAuthForm({ name: "", email: "", password: "" });
    } catch {
      showMessage("Backend is not connected. Please start backend server.");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      showMessage("Unable to fetch tasks");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    const url = editingId ? `${API_URL}/tasks/${editingId}` : `${API_URL}/tasks`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskForm)
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Task operation failed");
        return;
      }

      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: ""
      });

      setEditingId(null);
      fetchTasks();
      showMessage(editingId ? "Task updated successfully" : "Task created successfully");
    } catch {
      showMessage("Backend error");
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        showMessage(data.message || "Delete failed");
        return;
      }

      fetchTasks();
      showMessage("Task deleted successfully");
    } catch {
      showMessage("Delete failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("taskflowToken");
    localStorage.removeItem("taskflowUser");
    setToken("");
    setUser(null);
    setTasks([]);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const progressTasks = tasks.filter((task) => task.status === "In Progress").length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const highPriorityTasks = tasks.filter((task) => task.priority === "High").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!user) {
    return (
      <div className="auth-layout">
        <ThreeDBackground />

        <div className="auth-left">
          <div className="brand">
            <span className="brand-icon">✓</span>
            <h1>TaskFlow</h1>
          </div>

          <h2>Full Stack 3D Task Management System</h2>
          <p>
            Create, update, delete, and track tasks with secure authentication,
            JWT-protected APIs, JSON database storage, dashboard analytics,
            smart filters, and professional 3D UI effects.
          </p>

          <div className="feature-grid">
            <div>🔐 JWT Auth</div>
            <div>⚙️ Express Backend</div>
            <div>📊 Dashboard Stats</div>
            <div>🎯 Task Tracking</div>
          </div>

          <div className="api-pill">{apiStatus}</div>
        </div>

        <div className="auth-right">
          <div className="auth-card advanced-card">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>{isLogin ? "Login to continue your workflow." : "Register to start managing tasks."}</p>

            {message && <div className="toast">{message}</div>}

            <form onSubmit={handleAuth}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />

              <input
                type="password"
                placeholder="Password minimum 6 characters"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />

              <button className="primary-btn" type="submit">
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <button className="text-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "New user? Create an account" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <ThreeDBackground />

      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <span className="brand-icon">✓</span>
          <h1>TaskFlow</h1>
        </div>

        <div className="user-box">
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>My Tasks</a>
          <a>Analytics</a>
          <a>Settings</a>
        </nav>

        <div className="api-small">{apiStatus}</div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Task Management Application</p>
            <h1>Dashboard Overview</h1>
          </div>

          <div className="top-actions">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {message && <div className="toast floating-toast">{message}</div>}

        <section className="stats-grid">
          <StatCard title="Total Tasks" value={totalTasks} icon="📌" />
          <StatCard title="Pending" value={pendingTasks} icon="⏳" />
          <StatCard title="In Progress" value={progressTasks} icon="🚀" />
          <StatCard title="Completed" value={completedTasks} icon="✅" />
          <StatCard title="High Priority" value={highPriorityTasks} icon="🔥" />
        </section>

        <section className="progress-panel advanced-card">
          <div>
            <h2>Completion Progress</h2>
            <p>{completionRate}% of your tasks are completed.</p>
          </div>

          <div className="progress-bar">
            <span style={{ width: `${completionRate}%` }}></span>
          </div>
        </section>

        <section className="workspace">
          <div className="task-form-panel advanced-card">
            <h2>{editingId ? "Update Task" : "Create New Task"}</h2>
            <p>Add task details and track progress in real time.</p>

            <form onSubmit={handleTaskSubmit}>
              <input
                type="text"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Task description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                required
              />

              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              />

              <div className="form-row">
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <button className="primary-btn" type="submit">
                {editingId ? "Update Task" : "Add Task"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setEditingId(null);
                    setTaskForm({
                      title: "",
                      description: "",
                      priority: "Medium",
                      status: "Pending",
                      dueDate: ""
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="tasks-panel advanced-card">
            <div className="section-header">
              <div>
                <h2>Your Tasks</h2>
                <p>{filteredTasks.length} task(s) found</p>
              </div>

              <div className="filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option>All</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option>All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks found</h3>
                <p>Create a new task or change your filters.</p>
              </div>
            ) : (
              <div className="task-grid">
                {filteredTasks.map((task) => (
                  <div className="task-card" key={task.id}>
                    <div className="task-card-top">
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className={`status-badge ${task.status.replace(" ", "-").toLowerCase()}`}>
                        {task.status}
                      </span>
                    </div>

                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <div className="task-meta">
                      <span>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Today"}</span>
                      {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>

                    <div className="task-actions">
                      <button onClick={() => editTask(task)}>Edit</button>
                      <button className="danger-btn" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ThreeDBackground() {
  return (
    <div className="three-d-bg">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card advanced-card">
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
      <span>{icon}</span>
    </div>
  );
}

export default App;
