BREACH PROTOCOL — HOST EVIDENCE FILES
=====================================

These are the few "real" files that live on the Windows host for tactile realism.
The web terminal also shows the same content in its in-app Evidence Viewer, so these
are a bonus layer (and a fallback), not strictly required.

WHERE TO COPY (matches launch.bat / reset.bat defaults)
-------------------------------------------------------
  NIMBUS_USB\loader.txt          ->  C:\NIMBUS\Live\NIMBUS_USB\loader.txt
  NIMBUS_USB\exfil_list.csv      ->  C:\NIMBUS\Live\NIMBUS_USB\exfil_list.csv
  Evidence\badge_access.csv      ->  C:\NIMBUS\Live\Evidence\badge_access.csv
  Evidence\parking_lot_metadata.txt -> C:\NIMBUS\Live\Evidence\parking_lot_metadata.txt

Also keep a PRISTINE copy at C:\NIMBUS\_MASTER\... so reset.bat can restore them:
  C:\NIMBUS\_MASTER\Evidence\
  C:\NIMBUS\_MASTER\NIMBUS_USB\

PHYSICAL USB (Puzzle 5)
-----------------------
Copy NIMBUS_USB\loader.txt and exfil_list.csv onto a real USB stick labeled
"PROJECT FROST". Tape it under the evidence shelf. Players can open it in Notepad —
OR use the terminal's in-app Evidence Viewer (Files ▸ PROJECT FROST). Either path
gives the clue (initials "MW" + "see the Wi-Fi survey").

OPTIONAL: real EXIF on a real photo
-----------------------------------
For an extra-real metadata clue, take/any JPG named parking_lot.jpg and set its
"Comment" to:  BF: evil-twin live — survey it
Easiest way (Windows): right-click the JPG ▸ Properties ▸ Details ▸ Comments.
Or with one PowerShell/exiftool command (see setup guide). The .txt above is the
no-effort fallback.

EVERYTHING HERE IS FICTIONAL AND HARMLESS — plain text/CSV, no executables, no real data.
