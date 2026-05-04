# TaskFlow 3D - Full Stack Task Management Application

TaskFlow 3D is a full-stack task management application built for managing daily tasks with a modern 3D dashboard interface. Users can register, login, create tasks, update tasks, delete tasks, track task status, set priorities, add due dates, search tasks, and filter tasks.

## Live Demo

Frontend Live Link:  
https://tunavdewangan24.github.io/taskflow-fullstack-working/

GitHub Repository:  
https://github.com/tunavdewangan24/taskflow-fullstack-working

> Note: The frontend is deployed on GitHub Pages. Backend features like login, register, and task saving require the backend server to be running locally or hosted separately.

## Features

- User registration and login
- JWT authentication
- Password hashing using bcrypt
- Create, read, update, and delete tasks
- Task priority management: Low, Medium, High
- Task status tracking: Pending, In Progress, Completed
- Due date support
- Dashboard statistics
- Search and filter functionality
- Responsive design
- Professional 3D CSS effects
- JSON-based local database

## Tech Stack

### Frontend
- React.js
- Vite
- CSS3
- GitHub Pages

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- JSON file database

## Folder Structure

```txt
taskflow-fullstack-working/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── data/
│   │   └── database.json
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── db/
│       └── utils/
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── style.css
│
├── README.md
├── START_ALL.bat
├── START_BACKEND.bat
└── START_FRONTEND.bat
