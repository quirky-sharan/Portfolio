@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Sharan Soni - Portfolio
cd /d "%~dp0"

echo.
echo    SHARAN SONI  -  PORTFOLIO
echo    -------------------------
echo.

rem ---- 1. Node.js present? -------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
  echo    [x] Node.js is not installed.
  echo        Download the LTS version from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)

rem ---- 2. Node.js new enough?  Vite 7 needs 20.19+ or 22.12+ ---------------
for /f "delims=" %%v in ('node -v') do set "NODEV=%%v"
for /f "tokens=1,2 delims=v." %%a in ("!NODEV!") do (
  set "MAJOR=%%a"
  set "MINOR=%%b"
)
set "OK=0"
if !MAJOR! GEQ 23 set "OK=1"
if !MAJOR! EQU 22 if !MINOR! GEQ 12 set "OK=1"
if !MAJOR! EQU 20 if !MINOR! GEQ 19 set "OK=1"
if "!OK!"=="0" (
  echo    [x] Node !NODEV! is too old for this project.
  echo        It needs Node 20.19 or newer, or 22.12 or newer.
  echo        Download the LTS version from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)
echo    [ok] Node !NODEV!

rem ---- 3. Install packages on first run, and again whenever they change ----
set "NEED_INSTALL=0"
if not exist "node_modules\.installed-lock" set "NEED_INSTALL=1"
if "!NEED_INSTALL!"=="0" (
  fc /b "package-lock.json" "node_modules\.installed-lock" >nul 2>nul
  if errorlevel 1 set "NEED_INSTALL=1"
)
if "!NEED_INSTALL!"=="1" (
  echo    [..] Installing packages - first run takes a minute or two...
  echo.
  call npm ci --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo    [..] Clean install failed - trying a regular install instead...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
      echo.
      echo    [x] Could not install packages. Check your internet connection,
      echo        close any other window running this site, and try again.
      echo.
      pause
      exit /b 1
    )
  )
  copy /y "package-lock.json" "node_modules\.installed-lock" >nul
  echo.
)
echo    [ok] Packages ready

rem ---- 4. Run it ------------------------------------------------------------
echo.
echo    Starting the site - your browser will open by itself.
echo    Keep this window open while you use it. Press Ctrl+C to stop.
echo.
call npm run dev -- --open
if errorlevel 1 (
  echo.
  echo    [x] The dev server stopped with an error - see the messages above.
  echo.
  pause
)
endlocal
