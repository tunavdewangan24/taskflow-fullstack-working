@echo off
title TaskFlow Backend
cd /d "%~dp0backend"
call npm.cmd install
call npm.cmd run dev
pause
