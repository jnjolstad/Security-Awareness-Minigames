# 04 — Recommended Platform

## TL;DR recommendation

> **Build a HYBRID: a Windows 10/11 host that runs a self-contained local "NIMBUS Secure Terminal"
> website (plain HTML/CSS/JS) in full-screen kiosk mode, supported by a small set of real planted
> files (photos with metadata, the USB's contents, a CSV of badge logs).**

The web app *is* the puzzle computer (login → MFA → desktop → email → AI bot → kill switch). Windows
is just the reliable host that boots into it and provides a few real artifacts for forensic realism.

---

## Why a recommendation matters here

The brief's "locked computer" is the spine of the room. You need it to:
1. Look and feel like a real corporate machine,
2. Gate access convincingly (password + MFA),
3. Present emails, logs, photos, a network map, an AI bot, and a countdown,
4. **Reset perfectly in minutes** between back-to-back groups,
5. Be buildable with **moderate technical skill** and never lock *you* out.

No single "pure" platform nails all five. A hybrid does.

---

## Options compared

| Criterion | Pure Windows (real OS lock screen, real accounts) | Pure Linux (terminal/CLI puzzles) | Pure Web app (browser only) | ✅ **Hybrid (Windows host + local web terminal)** |
|---|---|---|---|---|
| Familiar to non-technical players | High | Low (intimidating CLI) | High | **High** |
| Easy to theme/brand (NIMBUS look) | Medium | Low | High | **High** |
| Convincing password **+ MFA** gate | Risky (real lockout possible) | Medium | High (fully scripted) | **High** |
| Emails, logs, AI bot, countdown | Needs many real apps | Hard | Trivial (just pages) | **Trivial** |
| Real forensic artifacts (EXIF, files) | High | High | None | **High (uses the few that matter)** |
| **Reset speed between groups** | Slow (accounts, state drift) | Slow | Instant | **Near-instant** |
| Risk of locking out the host/you | **High** | Medium | None | **None** |
| Build difficulty for moderate skill | Medium-High | High | Low | **Low-Medium** |
| Offline / no-internet safe | Yes | Yes | Yes | **Yes** |

**Result:** the Hybrid scores highest on every axis that matters for a repeatable, safe, themeable,
reset-friendly escape room.

---

## Why NOT the pure options

- **Pure Windows lock screen:** Using the *real* Windows login/MFA is fragile and dangerous — a wrong
  setting can lock you out, and theming the real lock screen with NIMBUS branding + a custom 6-digit
  MFA prompt is awkward. State (browser history, opened files) drifts between groups and is slow to
  reset.
- **Pure Linux/CLI:** A terminal-driven room intimidates non-technical players and risks becoming a
  "hacking lab," which the brief explicitly forbids. Great for a CTF, wrong for this audience.
- **Pure Web:** Loses the tactile realism of a *real* file on a *real* USB and real photo metadata —
  some of the most satisfying "this is a real computer" moments. (We keep a few real artifacts.)

---

## What the Hybrid looks like in practice

### Layer 1 — Windows host (the chassis)
- Windows 10/11, **auto-login** to a dedicated `NIMBUS-SOC` local account (no real password barrier;
  the *game's* barrier is the web login).
- On boot, a startup shortcut launches **Edge or Chrome in kiosk/full-screen mode** at
  `index.html` of the local terminal site — so players see the NIMBUS login, not the Windows desktop.
- A branded NIMBUS **wallpaper** shows for the brief moment before kiosk launches (and during the
  "real file" investigation beat).
- A handful of **real files** live in folders the web app "hands off" to:
  - `Evidence\parking_lot_metadata.txt` — supplied fallback for the optional real photo/EXIF clue.
  - `C:\NIMBUS\Live\NIMBUS_USB\` — the contents the planted USB reveals.
  - `Logs\badge_access.csv` — opened for the insider cross-reference (can also be shown inside the web app).

### Layer 2 — The local web "NIMBUS Secure Terminal" (the soul)
A folder of static files — no internet, no database required. Pages:

| Page | Role in the game |
|---|---|
| `login.html` | Username + passphrase gate (Puzzle 2) |
| `mfa.html` | 6-digit second-factor gate (Puzzle 3) |
| `desktop.html` | Faux desktop hub linking the apps below |
| `mail.html` | Inbox with the phishing email among legit ones (Puzzle 4) |
| `files.html` | "Confidential / Internal / Public" browser + hidden folder (Puzzles 4–7) |
| `network.html` | Interactive network map / Wi-Fi survey companion (Puzzle 6) |
| `assistant.html` | The tampered AI helpdesk bot (Puzzle 8) |
| `killswitch.html` | BLACKFROST countdown + final code entry (Finale) |
| `win.html` / `fail.html` | Endings + Alex's closing message |

- **Logic is plain JavaScript:** codes/passphrases are checked client-side; correct answers reveal the
  next page. A tiny shared `state.js` tracks progress so refreshes don't lose place (and a **host reset
  button**/keypress clears it instantly).
- **Optional, recommended:** run it via a one-line local server (`python -m http.server` or Node's
  `http-server`) for clean URLs and to make the "AI assistant" feel server-backed — but it also works
  by opening the files directly (`file://`).

### Layer 3 — The countdown (the pressure)
- The BLACKFROST timer runs in the web app and can be **mirrored to a second monitor or short-throw
  projector** so the whole team feels the clock without crowding the PC.

---

## The "AI assistant" (Puzzle 8) — how to build it safely & offline

You do **not** need a live AI model. Two equally good options:

1. **Scripted bot (recommended, zero-dependency):** a chat UI whose replies are keyword-matched in
   JavaScript. It gives misleading answers until it receives Alex's **override phrase**, then unlocks
   the truth. Fully offline, fully deterministic, trivially resettable — ideal for a room that runs
   dozens of times.
2. **Local LLM (optional flavor):** if you want genuine free-text chat, a small local model (e.g., via
   Ollama) with a **system prompt that has been "prompt-injected"** to hide info until the override
   phrase appears. More immersive, but heavier to set up and less predictable — only worth it if a
   technical host will supervise.

Phase 3 will provide the scripted version as the default and notes for the local-LLM upgrade.

---

## Hardware & software requirements

| Need | Spec |
|---|---|
| PC | Any modern Windows 10/11 machine (the web app is lightweight) |
| Browser | Edge or Chrome (kiosk mode) |
| Optional server | Python 3 (`http.server`) **or** Node (`http-server`) — both optional |
| Optional 2nd display | Monitor or projector for the room-wide countdown |
| Peripherals | Keyboard, mouse, a real USB stick, a UV torch, locks/lockbox (props) |
| Internet | **Not required** — everything runs locally (safer & demo-proof) |

---

## How the Hybrid delivers easy resets (critical for running all month)

Between groups the host:
1. Presses the hidden **reset hotkey** (or clicks a host-only "Reset" link) → web app returns to
   `login.html` with all progress cleared.
2. Restores the **`Evidence` and `NIMBUS_USB` folders** from a `_MASTER` copy (one drag-drop or a
   2-line `reset.bat`).
3. Re-arms the **physical props** per the Phase 5 checklist.

No reimaging, no account juggling, ~5 minutes total. Phase 3 ships the `reset.bat` and Phase 5 ships
the full checklist.

---

## Security & safety notes (for a *security* event, fittingly)

- **All offline & sandboxed:** no real malware, no real network attacks, no real credentials — every
  "hack" is a prop or a scripted page. The USB contains only harmless text/image files.
- **No real lockout risk:** the Windows account auto-logs-in; the only "lock" is the themed web page.
- **Privacy:** all names, emails, logs, and badges are fictional. No real employee data is used.
- **Accessibility:** web pages allow large fonts/high contrast; nothing depends on color alone (the
  rogue-SSID clue uses a letter swap, not just color); the UV clue has a non-UV fallback hint.

---

## Decision

✅ **Hybrid (Windows host + local NIMBUS Secure Terminal web app + a few real artifacts).**
It is the most immersive, the safest, the easiest to theme, and — decisively for a month-long Security
Awareness program — the fastest to reset and the hardest to break. Phase 3 builds exactly this.
