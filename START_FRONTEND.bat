@echo off
title TaskFlow Frontend
cd /d "%~dp0frontend"
call npm.cmd install
call npm.cmd run dev
pause
