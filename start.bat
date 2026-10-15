@echo off
rem Change folder first: delayed expansion (below) would mangle a "!" in the path.
rem pushd, unlike cd, also works when the folder is on a network or WSL path.
pushd "%~dp0" 2>nul || (
  echo.
  echo    [x] Windows could not open the folder this file is in.
  echo        Copy the whole folder onto your computer, e.g. C:\dev\Portfolio, and try again.
  echo.
  pause
  exit /b 1
)
rem OneDrive can make installing very slow or fail outright - remember for a hint
set "ONEDRIVE=0"
set "HERE=%CD%"
if /i not "%HERE:\OneDrive=%"=="%HERE%" set "ONEDRIVE=1"
set "HERE="
setlocal EnableExtensions EnableDelayedExpansion
title Sharan Soni - Portfolio

echo.
echo    SHARAN SONI  -  PORTFOLIO
echo    -------------------------
echo.

rem ---- 0. Opened from inside a zip? Windows only extracts this one file ----
if not exist "package.json" (
  echo    [x] This file was opened on its own, without the rest of the project.
  echo        Right-click the downloaded zip, choose "Extract All", then
  echo        double-click start.bat inside the extracted folder.
  echo.
  pause
  popd
  exit /b 1
)

rem ---- 1. Node.js present? -------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
  echo    [x] Node.js is not installed.
  echo        Download the LTS version from https://nodejs.org and run this again.
  echo.
  pause
  popd
  exit /b 1
)

rem ---- 2. Node.js new enough?  This project needs 22.12 or newer ------------
for /f "delims=" %%v in ('node -v') do set "NODEV=%%v"
for /f "tokens=1,2 delims=v." %%a in ("!NODEV!") do (
  set "MAJOR=%%a"
  set "MINOR=%%b"
)
set "OK=0"
if !MAJOR! GEQ 23 set "OK=1"
if !MAJOR! EQU 22 if !MINOR! GEQ 12 set "OK=1"
if "!OK!"=="0" (
  echo    [x] Node !NODEV! is too old for this project.
  echo        It needs Node 22.12 or newer.
  echo        Download the LTS version from https://nodejs.org and run this again.
  echo.
  pause
  popd
  exit /b 1
)
echo    [ok] Node !NODEV!

rem ---- 3. Install packages on first run, and again whenever they change ----
rem      (or when node_modules came from a different OS / CPU)
for /f "delims=" %%p in ('node -p "`${process.platform}-${process.arch}`"') do set "PLAT=%%p"
set "NEED_INSTALL=0"
if not exist "node_modules\.installed-lock" set "NEED_INSTALL=1"
if not exist "node_modules\.installed-platform" set "NEED_INSTALL=1"
if "!NEED_INSTALL!"=="0" (
  fc /b "package-lock.json" "node_modules\.installed-lock" >nul 2>nul
  if errorlevel 1 set "NEED_INSTALL=1"
  set /p OLDPLAT=<"node_modules\.installed-platform"
  if not "!OLDPLAT!"=="!PLAT!" set "NEED_INSTALL=1"
)
if "!NEED_INSTALL!"=="1" (
  echo    [..] Installing packages - first run takes a minute or two...
  if "!ONEDRIVE!"=="1" (
    echo         This folder is inside OneDrive, which can make this slow.
    echo         If it fails, move the folder outside OneDrive, e.g. C:\dev\Portfolio.
  )
  echo.
  rem forget the old install first, so a cancelled install is redone next time
  del /q "node_modules\.installed-lock" "node_modules\.installed-platform" >nul 2>nul
  call npm ci --no-audit --no-fund
  if !errorlevel! neq 0 (
    echo.
    echo    [..] Clean install failed - trying a regular install instead...
    call npm install --no-audit --no-fund
    if !errorlevel! neq 0 (
      echo.
      echo    [x] Could not install packages. Check your internet connection,
      echo        close any other window running this site, and try again.
      if "!ONEDRIVE!"=="1" echo        If it keeps failing, move the folder outside OneDrive, e.g. C:\dev\Portfolio.
      echo.
      pause
      popd
      exit /b 1
    )
  )
  copy /y "package-lock.json" "node_modules\.installed-lock" >nul
  > "node_modules\.installed-platform" echo !PLAT!
  echo.
)
echo    [ok] Packages ready

rem ---- 4. Run it ------------------------------------------------------------
echo.
echo    Starting the site - your browser will open by itself.
echo    Keep this window open while you use it. To stop it, press Ctrl+C, then Y.
echo.
call npm run dev -- --open
set "CODE=!errorlevel!"
rem stopping with Ctrl+C is not an error
if "!CODE!"=="-1073741510" set "CODE=0"
if "!CODE!"=="130" set "CODE=0"
if not "!CODE!"=="0" (
  echo.
  echo    [x] The dev server stopped with an error - see the messages above.
  if /i "%PROCESSOR_ARCHITECTURE%"=="ARM64" (
    echo        On Windows on ARM, "Required DLL was not found" means you need the
    echo        Microsoft Visual C++ runtime: https://aka.ms/vs/17/release/vc_redist.arm64.exe
  )
  echo        If it says EACCES on port 5173, run:  npm run dev -- --port 3000
  echo.
  pause
)
endlocal
popd
