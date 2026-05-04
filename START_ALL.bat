@echo off
title TaskFlow 3D Starter
echo ==========================================
echo Starting TaskFlow 3D Full Stack Project
echo ==========================================

start "TaskFlow Backend" cmd /k "cd /d %~dp0backend && npm.cmd install && npm.cmd run dev"

timeout /t 4 >nul

start "TaskFlow Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd install && npm.cmd run dev"

echo.
echo Backend will run on:  http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Open http://localhost:5173 after frontend starts.
pause
