@echo off
title Flood Risk Dashboard Setup
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-local.ps1"
if errorlevel 1 (
  echo.
  echo Setup did not finish. Read the message above, fix the issue, and run this file again.
)
echo.
echo The backend and frontend run in their own command windows.
echo Keep those windows open while using the dashboard. Close them to stop it.
pause
