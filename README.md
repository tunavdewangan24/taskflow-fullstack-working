# TaskFlow 3D - Full Stack Task Management Application

This is a full working full-stack project for Thiranex Task 2.

## What is included

### Frontend
- React + Vite
- Professional 3D UI
- Login and register pages
- Dashboard with task statistics
- Create, edit, delete, and track tasks
- Search and filter tasks
- Responsive design

### Backend
- Node.js + Express.js
- JWT authentication
- bcrypt password hashing
- Protected API routes
- Full CRUD APIs for tasks
- Dashboard stats API
- JSON file database
- Error handling
- CORS setup
- Health check API

## How to start

### Easy method

Double-click:

```txt
START_ALL.bat
```

Then open:

```txt
http://localhost:5173
```

### Manual method

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Test account

Create your own account from the Register page.

Password must be at least 6 characters.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Check backend |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get profile |
| GET | /api/tasks | Get user tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get one task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/dashboard/stats | Dashboard stats |

## Submission Description

TaskFlow 3D is a full-stack task management application where users can register, login, and manage daily tasks. It includes secure JWT authentication, password hashing with bcrypt, protected backend APIs, complete CRUD operations, task priority/status tracking, due dates, dashboard analytics, search and filters, and a modern 3D responsive React interface.
