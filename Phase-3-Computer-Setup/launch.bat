@echo off
REM =====================================================================
REM  BREACH PROTOCOL — LAUNCH  (start the room for a new group)
REM  Opens the NIMBUS Secure Terminal in full-screen kiosk mode.
REM  The host presses Start Mission on the login screen to begin the clock.
REM  EDIT the path below if you installed somewhere other than C:\NIMBUS.
REM =====================================================================

set "TERMINAL=C:\NIMBUS\NIMBUS-Secure-Terminal\index.html"

REM ---- Edge kiosk (default) ----
start "" msedge --kiosk "file:///%TERMINAL:\=/%" --edge-kiosk-type=fullscreen --no-first-run --disable-features=Translate

REM ---- Chrome alternative (comment the Edge line, uncomment this) ----
REM start "" chrome --kiosk "file:///%TERMINAL:\=/%" --no-first-run

REM ---- OPTIONAL: also open the big countdown on a 2nd monitor/projector ----
REM start "" msedge --new-window "file:///C:/NIMBUS/NIMBUS-Secure-Terminal/timer.html"

exit
