@echo off
REM =====================================================================
REM  BREACH PROTOCOL — ROOM RESET  (run between groups)
REM  1) closes the kiosk browser (clears digital progress automatically)
REM  2) restores the evidence files from the pristine _MASTER copy
REM  3) relaunches the terminal in full-screen kiosk mode
REM
REM  EDIT the paths below to match where you installed the room.
REM =====================================================================

set "ROOT=C:\NIMBUS"
set "TERMINAL=%ROOT%\NIMBUS-Secure-Terminal\index.html"
set "MASTER=%ROOT%\_MASTER"
set "LIVE=%ROOT%\Live"

echo.
echo [1/3] Closing kiosk browser...
taskkill /IM msedge.exe /F >nul 2>&1
taskkill /IM chrome.exe /F >nul 2>&1
timeout /t 1 >nul

echo [2/3] Restoring evidence files from _MASTER...
robocopy "%MASTER%\Evidence"   "%LIVE%\Evidence"   /MIR >nul
if errorlevel 8 (
  echo ERROR: Failed to restore Evidence from "%MASTER%\Evidence".
  echo Check the ROOT path and master files, then run reset again.
  pause
  exit /b 1
)
robocopy "%MASTER%\NIMBUS_USB" "%LIVE%\NIMBUS_USB" /MIR >nul
if errorlevel 8 (
  echo ERROR: Failed to restore NIMBUS_USB from "%MASTER%\NIMBUS_USB".
  echo Check the ROOT path and master files, then run reset again.
  pause
  exit /b 1
)

echo [3/3] Relaunching terminal (fresh session = cleared progress)...
REM ---- Edge kiosk (default). Swap to the Chrome line if you prefer. ----
start "" msedge --kiosk "file:///%TERMINAL:\=/%" --edge-kiosk-type=fullscreen --no-first-run --disable-features=Translate
REM start "" chrome --kiosk "file:///%TERMINAL:\=/%" --no-first-run

echo.
echo ============================================================
echo  DIGITAL RESET COMPLETE.
echo  Now re-arm the PHYSICAL props (Phase 5 reset checklist):
echo   - relock the reception lockbox (off 2071)
echo   - return desk key + Alex's note to the lockbox
echo   - re-stick the yellow decoy note, replace 4 dot-objects
echo   - return authenticator token to the drawer; reseal MFA envelope
echo   - re-tape the PROJECT FROST USB under the evidence shelf
echo   - reset folders/binders and the red Confidential folder
echo ============================================================
echo.
pause
