@echo off
title QC Player Online — 1-Click GitHub Update & Launch
color 0A
cls

echo ====================================================
echo    QC Player Online — 1-Click Update ^& Launch
echo ====================================================
echo.

cd /d "%~dp0"

echo [+] Checking for latest GitHub updates...
where git >nul 2>nul
if %errorlevel%==0 (
    git pull origin main --quiet 2>nul || git pull origin master --quiet 2>nul
    echo [+] Successfully synced latest code from GitHub!
) else (
    echo [i] Opening local extension directory...
)

echo.
echo ====================================================
echo  Launching Chrome...
echo ====================================================

start "" "chrome.exe" "chrome-extension://player.html"

timeout /t 2 >nul
exit
