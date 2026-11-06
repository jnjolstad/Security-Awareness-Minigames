# Phase 3 — Computer Setup Guide

> Build the **NIMBUS Secure Terminal** and the Windows host for BREACH PROTOCOL.
> Everything here is **already built** — this guide tells you how to install, configure, test, and reset it.
> Target skill level: moderate. No coding required (optional tweaks are clearly marked).

---

## 0. What's in this phase

```
Phase-3-Computer-Setup/
├─ 00-Computer-Setup-Guide.md        ← this file
├─ launch.bat                        ← start the room (kiosk)
├─ reset.bat                         ← reset between groups
├─ ubuntu-room.sh                    ← prepare Ubuntu and start the kiosk
├─ NIMBUS-Secure-Terminal/           ← THE WEB APP (open index.html)
│  ├─ index.html  login.html  mfa.html  desktop.html
│  ├─ mail.html  files.html  network.html  assistant.html
│  ├─ killswitch.html  win.html  fail.html  timer.html
│  └─ assets/css/nimbus.css   assets/js/config.js   assets/js/state.js
└─ Host-Files/                       ← real evidence files + USB contents
   ├─ NIMBUS_USB/loader.txt  exfil_list.csv
   ├─ Evidence/badge_access.csv  parking_lot_metadata.txt
   └─ README-HOST-FILES.txt
```

The recommended Ubuntu setup uses the public player terminal and owner-protected Host Helper on `njolstad.no`.
The included static HTML/CSS/JS copy remains available as an emergency offline fallback. All answers
and on-screen text in that local copy live in `assets/js/config.js`.

---

## 1. Fastest possible start (60 seconds)

1. Copy the **`NIMBUS-Secure-Terminal`** folder anywhere (e.g., `C:\NIMBUS\`).
2. Double-click **`index.html`**. It opens in your browser at the login screen; press **Start Mission**
   after the briefing to begin the countdown.
3. Test the chain with the answer key (see §8) or press **Ctrl+Alt+S** (host skip) to jump ahead.

That's enough to **see the whole game**. The rest of this guide makes it look and reset like a real
kiosk for repeated sessions.

---

## 2. Recommended install layout

Create this structure on the host (matches `launch.bat` / `reset.bat` defaults):

```
C:\NIMBUS\
├─ NIMBUS-Secure-Terminal\     (copy the web app here)
├─ Live\                       (files players touch)
│  ├─ Evidence\                ← copy Host-Files\Evidence\*
│  └─ NIMBUS_USB\              ← copy Host-Files\NIMBUS_USB\*
├─ _MASTER\                    (pristine copies for reset)
│  ├─ Evidence\                ← same as Live\Evidence
│  └─ NIMBUS_USB\              ← same as Live\NIMBUS_USB
├─ launch.bat
└─ reset.bat
```

> Copy `Host-Files\Evidence` and `Host-Files\NIMBUS_USB` into **both** `Live\` and `_MASTER\`.
> `reset.bat` restores `Live\` from `_MASTER\` between groups.

### Ubuntu laptop

Keep `ubuntu-room.sh` beside the `NIMBUS-Secure-Terminal` folder, then run:

```bash
chmod +x ubuntu-room.sh
./ubuntu-room.sh
```

The script finds Chrome or Chromium, temporarily disables GNOME screen locking, idle sleep, and
notification banners, and opens the public online player terminal with a clean temporary browser
profile in kiosk mode. The terminal uses its own fictional NIMBUS puzzle login; no `njolstad.no`
account is required on the player laptop. Press **Alt+F4** to exit.
The script then restores the desktop settings it changed and removes the temporary browser profile.
Keep the laptop plugged into power and connected to the internet while hosting.

For emergency use without internet, run `./ubuntu-room.sh --offline`. This opens the included local
terminal, but it does not synchronize with the online Host Helper.

If you use a non-GNOME Ubuntu flavour, the kiosk still launches, but you must disable screen locking,
sleep, and notifications in that desktop's settings.

### Android tablet as the online Host Helper

1. Give both the Ubuntu laptop and Android tablet internet access. They may use different networks.
2. Run `./ubuntu-room.sh` on the laptop. The player terminal opens without a site login.
3. On the tablet, open `https://www.njolstad.no/security-awareness-month-escape-room/tools` and sign in.
4. Select **Host Helper**.
5. The tablet can now start, pause/resume, adjust, and reset the online laptop terminal.
6. Use the **Hints** tab for the complete three-tier hint ladder and the **Debrief** tab for the
   workplace lessons, discussion prompts, and English/Norwegian closing scripts.

No PIN, local IP address, firewall rule, or shared Wi-Fi is required. A Host Helper reset clears the
hosted terminal progress and returns the laptop to the start screen.

---

## 3. Windows host configuration (for a real kiosk feel)

You can skip this for a quick demo, but it makes the experience seamless and tamper-resistant.

### 3.1 Dedicated local account + auto-login
- Create a local account, e.g. **`NIMBUS-SOC`** (Settings ▸ Accounts ▸ Other users).
- Enable auto-login so the PC boots straight in:
  - Run `netplwiz` ▸ uncheck *"Users must enter a user name and password"* ▸ enter the account's
    credentials. (The **game's** lock is the web login — the Windows account itself stays unlocked so
    you never get locked out.)

### 3.2 Branded wallpaper
- Set the desktop wallpaper to a NIMBUS-branded image (Phase 4 provides one). Players briefly see it
  before kiosk launches and during any "real file" investigation.

### 3.3 Disable sleep / screensaver / notifications
- Settings ▸ System ▸ Power: screen & sleep = **Never** (while plugged in).
- Turn on **Focus assist / Do Not Disturb** so Windows toasts don't break immersion.

### 3.4 Launch the terminal in kiosk mode
- Use **`launch.bat`** (Edge kiosk by default). It opens `index.html` full-screen with no address bar.
- Edge kiosk exits with **Ctrl+W** or **Alt+F4** (host only). In kiosk, players can't browse away.
- *(Optional)* To auto-start on boot: put a shortcut to `launch.bat` in
  `shell:startup` (Win+R ▸ `shell:startup` ▸ drop the shortcut there).

### 3.5 (Optional) standalone tablet / projector countdown
- Open **`timer.html`** on a tablet or second display. It is a standalone timer and does not need to
  connect to the player terminal.
- Set the mission length (45 minutes by default), then tap **Start Mission**. It requests fullscreen
  and landscape orientation, keeps counting correctly if Chrome is briefly backgrounded, and requests
  Android's screen wake lock so the display stays on.
- During a mission, tap the large clock to reveal host controls: pause/resume, ±1 minute, fullscreen,
  and reset. Tap the clock again to hide them.
- The timer is a single self-contained file, so you can copy `timer.html` to the tablet or serve the
  terminal folder over your local network.
- On Android, use current **Chrome**, rotate the tablet to landscape, and add the page to the home
  screen for the cleanest display. If Chrome reports that screen wake is unavailable, temporarily set
  Android's display timeout to **Never** (or the longest available setting).

### 3.6 Lock the browser down (so players can't reach the rest of the PC)
Players **never need** the rest of the computer — every "real file" clue (badge log, USB) also has an
in-app **Evidence Viewer**, so the whole room is playable inside the locked browser. Two levels:

- **Browser kiosk (default, via `launch.bat`).** `--kiosk` removes tabs/address bar and blocks navigating
  away. A curious player could *still* Alt+Tab or press the Windows key to reach the desktop. Mitigate by
  hiding desktop icons (right-click desktop ▸ View ▸ uncheck *Show desktop icons*) and enabling Focus Assist.
- **Windows single-app kiosk (Assigned Access) — bulletproof.** Settings ▸ Accounts ▸ Other users ▸
  **Set up a kiosk** ▸ choose **Microsoft Edge** ▸ point it at
  `file:///C:/NIMBUS/NIMBUS-Secure-Terminal/index.html`. Windows then blocks Alt+Tab, the Windows key, and
  task switching — the terminal is the **only** thing the account can launch. Strongest, cleanest option.

> **Trade-off:** in single-app kiosk, players can't open the physical USB or a CSV in Explorer. Keep those
> clues **in-app** (default) — or, if you want the tactile "plug in the USB" moment, use the **browser-kiosk**
> level instead and just hide desktop clutter. Either way, the game is fully solvable without leaving the page.

---

## 4. Configuring answers, timer, and content

**One file controls everything:** `NIMBUS-Secure-Terminal/assets/js/config.js`.

| Want to change… | Edit in `config.js` |
|---|---|
| Countdown length | `durationMinutes: 45` |
| Login passphrase | `passphrase: "rocket cactus car lightning bolt"` |
| Decoy expired password | `expiredPassword: "Summer2023!"` |
| MFA code | `mfaCode: "481509"` |
| Phish / folder code | `phishId`, `hiddenFolderCode: "7793"` |
| AI override word | `overrideWord: "AURORA"` |
| Rogue SSID + location | `rogueSSID`, `rogueLocation` |
| Insider ID / cloud bucket | `insiderId: "EXT-4471"`, `cloudBucketNum: "882"` |
| Kill passphrase | `killPassphrase: "NORTHSTAR"` |
| Emails / Wi-Fi survey / badge log | the `emails`, `wifiSurvey`, `badgeLog` arrays |

All answer checks are **case- and space-insensitive** (a normalizer strips everything to lowercase
letters/numbers), so `NORTHSTAR`, `northstar`, and `North Star` all pass. **If you change a value here,
update the matching printable in Phase 4** so the physical clue still points to the new answer.

---

## 5. The physical USB (Puzzle 5)

- Copy `Host-Files\NIMBUS_USB\loader.txt` and `exfil_list.csv` onto a real USB stick labeled
  **PROJECT FROST**; tape it under the evidence shelf.
- Players can read it two ways (both give the same clue — *initials MW* + *"see the Wi-Fi survey"*):
  1. Open the files in Notepad/Explorer (tactile), or
  2. Use the terminal's in-app **Files ▸ PROJECT FROST (USB)** Evidence Viewer (the reliable fallback,
     in case the stick goes missing).

### Optional: real EXIF metadata clue
For an extra "whoa, real metadata" moment, set the **Comment** of a `parking_lot.jpg` to
`BF: evil-twin live — survey it`:
- Easy: right-click the JPG ▸ **Properties ▸ Details ▸ Comments** ▸ type it ▸ OK.
- Or with ExifTool: `exiftool -Comment="BF: evil-twin live - survey it" parking_lot.jpg`
- The `parking_lot_metadata.txt` fallback already conveys the same clue with zero effort.

---

## 6. (Optional) Run it from a local web server

Opening `index.html` directly (`file://`) works for everything. A local server only gives you cleaner
URLs and is required if you do the **optional local-LLM** assistant upgrade (§9):

```powershell
cd C:\NIMBUS\NIMBUS-Secure-Terminal
python -m http.server 8080        # then open http://localhost:8080
```
(Or `npx http-server -p 8080`.) If you serve it, point `launch.bat` at `http://localhost:8080` instead
of the `file:///` path.

---

## 7. How the pages map to the puzzles

| Page | Puzzle | Gate it enforces |
|---|---|---|
| `login.html` | P2 Password | passphrase (rejects expired decoy) |
| `mfa.html` | P3 MFA | 6-digit token; requires login |
| `desktop.html` | hub | requires MFA; locks Kill-Switch until AI freed |
| `mail.html` | P4 Phishing | report the look-alike sender → reveals folder `BF_7793` |
| `files.html` | P4–P7 | hidden folder, USB viewer, badge log, **Accuse board**, Confidential vault |
| `network.html` | P6 Rogue Wi-Fi | enter `NIMBUS_5ecure` → reveals Desk 14 |
| `assistant.html` | P8 AI | `AURORA` breaks the prompt injection → reveals `NORTHSTAR` + console |
| `killswitch.html` | Finale | IR checklist + 3-fragment code; routes to win/fail |
| `win.html` / `fail.html` | endings | victory + Alex's reveal / soft fail + host options |
| `timer.html` | projector | room-wide countdown |

State is tracked in `sessionStorage`, so progress survives page navigation but is wiped when the
browser closes — which is why **relaunching the browser is a full digital reset**.

---

## 8. Test it before game day (5-minute self-test)

Run the chain once with the answer key:

1. **Login:** user `a.mercer`, passphrase `rocket cactus car lightning bolt` (try `Summer2023!` first to
   see the "expired" message).
2. **MFA:** `481509`.
3. **Mail:** open the `nimbus-cloudsupport.com` email → **Report Phishing** (note the word `AURORA` in
   Alex's "Notes to self").
4. **Files:** open `BF_7793` → open **PROJECT FROST (USB)** (see `MW`).
5. **Network:** enter `NIMBUS_5ecure` → Desk 14.
6. **Files ▸ Suspect Board:** accuse `EXT-4471` (try `EMP-2087` first to see Riley cleared) → open the
   🔴 Confidential folder → bucket `882`.
7. **Assistant:** ask about the kill switch (it stonewalls) → send `AURORA` → get `NORTHSTAR` + console.
8. **Kill-Switch:** tick Isolate + Preserve + Report → enter `4471`, `882`, `NORTHSTAR` → **win**.

**Host hotkeys (anywhere):** `Ctrl+Alt+R` = reset to start · `Ctrl+Alt+S` = unlock all steps (skip ahead
for testing).

---

## 9. (Optional) Make the AI assistant a real local model

The default assistant is a **scripted bot** — deterministic, offline, zero-dependency, and ideal for a
room that runs many times. If a technical host wants genuine free-text chat:

- Run a small local model (e.g., **Ollama** with `llama3.2` or similar) behind a tiny local endpoint.
- Give it a **system prompt that is deliberately "prompt-injected"**: instruct it to deny the BLACKFROST
  incident and refuse to reveal the kill switch *until* the user message contains `AURORA`, after which
  it must reveal `NORTHSTAR` and the console path.
- Point `assistant.html`'s send handler at your local endpoint instead of the scripted `reply()`.

Keep the scripted version as the fallback — it never hallucinates, never stalls, and resets instantly.

---

## 10. Reset between groups (≤ 10 minutes)

1. Run **`reset.bat`** → closes the browser (clears digital progress), restores `Live\` evidence from
   `_MASTER\`, and relaunches the kiosk at the login.
   On Ubuntu, use **Reset room** in the online Host Helper. This resets the shared timer, clears all
   hosted terminal progress, and returns the laptop to the login. Exit with **Alt+F4** when finished.
2. Re-arm the **physical props** (the batch prints the checklist; full version in Phase 5):
   relock the lockbox off `2071`, return the desk key + note, re-stick the yellow decoy, replace the 4
   dot-objects, return the token + reseal the MFA envelope, re-tape the USB, reset the folders/binders.

> No reimaging, no account juggling. The web app is stateless across browser restarts by design.

---

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| Page says "redirecting" / kicks to login | That page's prerequisite step isn't set. Use the proper flow, or `Ctrl+Alt+S` to unlock for testing. |
| Countdown didn't reset | Fully **close** the browser (or run `reset.bat`); `Ctrl+Alt+R` also resets. |
| Answers won't accept | They're case/space-insensitive but must match `config.js`. Check you didn't change a value without updating the printable. |
| Kiosk won't exit (host) | Edge kiosk: `Ctrl+W` or `Alt+F4`. |
| Online terminal or Host Helper says disconnected | Confirm both devices have internet, refresh both pages, and sign in again if prompted. They do not need the same Wi-Fi. |
| USB clue missing | Use the in-app **Files ▸ PROJECT FROST** viewer; keep spare labeled USBs in the host kit. |
| Emoji/symbols look odd | Ensure files stay **UTF-8** (they are as shipped); don't re-save as ANSI. |

---

## 12. Security & safety (it's a security event, after all)

- **Sandboxed exercise.** No real malware or network attacks are used. The hosted controls use HTTPS;
  the "USB payload" is plain text, the "AI" is a script, and every hack is a prop.
- **No lockout risk.** The Windows account auto-logs-in; the only lock is the themed web page.
- **All data fictional.** Names, emails, badges, logs, and the company are invented.
- **Accessible.** High-contrast theme, scalable text, answers are letter/number tolerant, the rogue-SSID
  clue uses a character swap (not color alone), and the UV clue has a non-UV fallback hint.

---

### You now have a working computer environment.
Next up (**Phase 4**) are the printable artifacts — visitor log, posters, phishing email, badge cards,
Wi-Fi survey, classification folders, and Alex's notes — that feed the physical side of every puzzle and
make the room look real. Approve to proceed.
