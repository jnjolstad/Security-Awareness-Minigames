# Puzzle 5 — "The Drop"

| | |
|---|---|
| **Mode** | Physical → Computer |
| **Position in chain** | After P4 (folder points to USB) → unlocks Puzzle 6 (Wi-Fi) |
| **Output** | Attacker initials **MW** + pointer "see Wi-Fi survey" |

---

### 1. Puzzle Name
**The Drop** — *"Never trust a USB you didn't buy."*

### 2. Story Purpose
The hidden folder said the malware came from **removable media**. Players find the physical USB Alex
hid (labeled **PROJECT FROST**), examine it safely in the terminal's **evidence viewer**, and uncover
the attacker's tools — leaving the initials **MW** and a pointer to the rogue Wi-Fi.

### 3. Security Topic
**USB Security** · Device Security (USB-drop / baiting attacks).

### 4. Learning Objective
Players learn the **USB-drop attack**: attackers leave malware-loaded drives for curious people to
plug in. The in-game framing (a forensic **sandbox/evidence viewer**) reinforces the real rule —
*never plug an unknown USB into a normal computer; hand it to security.*

### 5. Setup Instructions
1. Tape the **PROJECT FROST USB** under the **evidence shelf** (Zone D).
2. Pre-load `C:\NIMBUS\Live\NIMBUS_USB\` (or the web app's evidence viewer) with `loader.txt` and
   `exfil_list.csv`. Optionally add your own `parking_lot.jpg` with planted EXIF.
3. Optional: pin the **parking-lot photo print** on the SOC wall as the USB-drop origin story.
4. Ensure the evidence viewer is framed as **isolated/sandboxed** ("Evidence Viewer — air-gapped").

### 6. Materials Needed
- 1 × USB stick labeled **PROJECT FROST** (taped under shelf)
- Files: `loader.txt`, `exfil_list.csv`; optional custom `parking_lot.jpg`
- 1 × printed parking-lot photo (artifact D1, optional)
- The evidence-viewer page or real `C:\NIMBUS\Live\NIMBUS_USB` folder

### 7. Exact Puzzle Layout

**`loader.txt` (key file):**
> ```
> # PROJECT FROST — staging notes
> staged_by: MW
> method: USB drop (parking lot) → autorun loader
> beacon: clone of corporate Wi-Fi — SEE THE WI-FI SURVEY ON THE SOC WALL
> dest: \\CONFIDENTIAL\ClientVault  → personal cloud
> ```

**`exfil_list.csv` (what was stolen — all Confidential, foreshadows P7):**
> ```
> file,classification
> ClientVault/AcmeCorp_contracts.pdf,CONFIDENTIAL
> ClientVault/payroll_master.xlsx,CONFIDENTIAL
> ClientVault/keys_backup.kdbx,CONFIDENTIAL
> ```

**Optional `parking_lot.jpg` EXIF (the supplied `parking_lot_metadata.txt` is the fallback):**
> *Camera comment:* `BF: evil-twin live — survey it`. *(Optional GPS pin = the office parking lot.)*

**Artifact D1 — parking-lot photo print:** a USB stick on asphalt near a "NIMBUS — Staff Parking" sign;
caption on the back: *"Found 3 of these in the lot this week. Did anyone plug one in?"*

### 8. How Players Discover It
The `BF_7793` readme from Puzzle 4 explicitly says the loader came from removable media labeled
**PROJECT FROST**, hidden "under the evidence shelf." Players search the shelf and find the taped USB.

### 9. How Players Solve It
Players plug the USB into the PC (into the clearly-labeled **air-gapped Evidence Viewer**), open
`loader.txt`, and read two things: the attacker's initials **MW** (`staged_by: MW`) and the instruction
to **check the Wi-Fi survey** on the SOC wall. The `exfil_list.csv` shows everything stolen was
**Confidential** (setup for Puzzle 7).

### 10. Solution
USB contents reveal **initials MW** + **"see the Wi-Fi survey"** → players move to the SOC wall for
Puzzle 6, carrying "MW" for the Puzzle 7 identification.

### 11. Hint 1 (nudge)
*"The folder said the malware rode in on a **USB** labeled PROJECT FROST, hidden under the evidence
shelf. Feel underneath."*

### 12. Hint 2 (method)
*"Plug it into the **Evidence Viewer** (it's sandboxed — safe). Open `loader.txt` and read who staged it
and where it tells you to look next."*

### 13. Hint 3 (all but answer)
*"`loader.txt` says `staged_by: MW` and 'clone of corporate Wi-Fi — see the Wi-Fi survey.' Remember
**MW**, and head to the **Wi-Fi survey** on the SOC wall."*

### 14. Reset Instructions
`reset.bat` restores `C:\NIMBUS\Live\NIMBUS_USB` from `_MASTER`. Re-tape the USB under the shelf; re-pin the photo.
(~1 min.)

### 15. Estimated Solve Time
**~6 minutes.**

> **Debrief note (Phase 5):** stress the real-world rule — *do not* plug in found USBs; here it was only
> safe because it went into an isolated forensic viewer.
