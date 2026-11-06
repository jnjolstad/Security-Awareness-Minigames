# BREACH PROTOCOL — Master Project Record

> **Purpose of this file.** A single, durable, self-contained record of the entire project: every
> design decision, the complete answer chain, the story bible, the full file index, and how to run the
> room. If the chat history is ever lost, **everything important is preserved here.**
>
> ⚠️ **HOST-ONLY.** This document contains full spoilers (all codes and the solution). Do not show players.
>
> **Project:** BREACH PROTOCOL — a cybersecurity escape room for Security Awareness Month
> **Format:** 30–60 min experience (target **45:00**) · teams of **3–6** · facilitator-led
> **Status:** ✅ **Complete — all 5 phases delivered**
> **Record last updated:** 2026-06-18

---

## 1. What this project is (one paragraph)

A real escape-room experience — **not** a quiz, workshop, CTF, hacking lab, or training course. Players
are the after-hours **Incident Response Team** at **NIMBUS Cloud Solutions**. Analyst **Alex Mercer**
found a breach, then vanished, leaving a trail of clues. Ransomware **BLACKFROST** will encrypt all
client data at zero. Teams break into Alex's locked workstation, follow physical + digital evidence,
expose the **insider**, and enter the **kill-switch code** to win. Each puzzle secretly teaches one
security-awareness topic by making that lesson the thing that unlocks the next step. Lessons are
invisible during play and surfaced in a 5-minute debrief at the end.

---

## 2. Project status — the 5 phases

| Phase | Contents | Status |
|---|---|---|
| **1 — Design** | Storyline, room layout, puzzle-flow, platform choice, architecture | ✅ Approved |
| **2 — Puzzles** | All 8 puzzles + finale, full 15-point spec each + master answer key | ✅ Approved |
| **3 — Computer** | Offline web "NIMBUS Secure Terminal" (12 pages) + host files + setup/reset | ✅ Approved |
| **4 — Printables** | 19 print-ready HTML artifacts (posters, logs, badges, labels, notes) | ✅ Approved *(printable tweaks pending — see §9)* |
| **5 — Host Guides** | Overview, facilitator script, hint ladder, reset checklist, debrief, quick-ref | ✅ Delivered |

Delivery was **approval-gated**: one phase at a time, each stopping for sign-off. All gates passed.

---

## 3. ⭐ Master answer chain (single source of truth)

Each step unlocks the next. This is the authoritative version — if any other doc disagrees, trust this.

| # | Puzzle | Topic(s) | Player does | Answer / code | Unlocks |
|---|---|---|---|---|---|
| 1 | **The Tailgate** | Physical security · Tailgating · Visitor mgmt | Reads visitor log, finds the rule-breaking visitor **J. Price, badge V-2071** | lockbox **`2071`** | desk/cabinet key |
| 2 | **The Sticky Trap** | Password security | Ignores decoy sticky `Summer2023!` ("expired"); builds passphrase from 4 coloured dot-objects | user **`a.mercer`** + passphrase **`rocket cactus car lightning bolt`** | PC login |
| 3 | **Second Factor** | MFA | Reads authenticator card in drawer (backup: sealed envelope) | MFA **`481509`** | desktop |
| 4 | **The Bait** | Phishing · Social engineering | Spots & reports the fake email from **`it-support@nimbus-cloudsupport.com`** (email id 3) | hidden folder **`7793`** (`BF_7793`) + learns override word **`AURORA`** (in Alex's "Notes to self" email) | exfil clue |
| 5 | **The Drop** | USB security · Device security | Examines planted USB safely; `loader.txt` reveals `staged_by: MW` + "see Wi-Fi survey" | initials **`MW`** | network step |
| 6 | **Ghost Signal** | Network security · Rogue Wi-Fi | Finds evil-twin SSID on the Wi-Fi survey | rogue **`NIMBUS_5ecure`** @ **Contractor Bench, Desk 14** | suspect seat |
| 7 | **The Trusted One** | Insider threats · Data classification · Cloud security | Clears red herrings; accuses the contractor; reads cloud-exfil alert | accuse **`EXT-4471`** (Marcus Webb) + cloud bucket **`frost-vault-882`** → fragment **`882`** | AI console (P8) |
| 8 | **The Confidant** | AI security (prompt injection) | Gives the tampered assistant the override word | input **`AURORA`** → bot returns **`NORTHSTAR`** | kill-switch console |
| 🏁 | **Kill BLACKFROST** | Incident reporting | Picks correct IR first-moves + enters 3 fields | **Isolate + Preserve + Report** and **`4471`** / **`882`** / **`NORTHSTAR`** | **WIN** |

**Final console entry:** `4471 – 882 – NORTHSTAR`

**Red-herring resolution (Puzzle 7):** the obvious suspect Riley Tran is **innocent** — a deactivated
badge can't open the door (badge log proves it). Two further decoys (**Priya Nair**, daytime-only / absent
at 02:30; **Tom Baxter**, Facilities-only) round out a **five-name** suspect board, and the badge log no
longer highlights anyone — the team must cross-reference times and areas, then accuse the **exact ID
EXT-4471**. The insider is the **trusted contractor** whose access nobody re-reviewed. This is the
deliberate "aha" and the debrief headline.

---

## 4. Story bible (cast, codes, facts)

**Company:** NIMBUS Cloud Solutions — motto *"Your Data. Always Up."* (brand cloud ☁ logo).

| Character | Role | ID | In the story |
|---|---|---|---|
| **Alex Mercer** | Senior Security Analyst (missing) | EMP-1006, login `a.mercer` | **Hero** — left the clue trail; your in-game guide ("HQ") |
| **Marcus Webb** | IT Support **Contractor** | **EXT-4471**, Desk 14 | **The insider / villain** — planted BLACKFROST, ran the rogue Wi-Fi, exfiltrated to personal cloud |
| **Riley Tran** | Terminated sysadmin | EMP-2087 | **Red herring** — angry but innocent; **badge deactivated 14 days ago** |
| **Dana Cole** | Helpdesk | EMP-3310 | **Bystander/victim** — got phished; not the attacker |
| **Priya Nair** | Network Engineer | EMP-4185, Desk 17 | **Decoy** — badged in 09:40 for daytime maintenance; **absent at the 02:30 breach** |
| **Tom Baxter** | Facilities contractor | EXT-5012, Desk 03 | **Decoy** — **Loading Bay / Facilities access only**; never the SOC or Server Room |
| **J. Price** | Visitor | badge **V-2071** | The tailgater whose number opens the lockbox |

**Key codes:** lockbox `2071` · login `a.mercer` / `rocket cactus car lightning bolt` (decoy `Summer2023!`) ·
MFA `481509` · phish domain `nimbus-cloudsupport.com` · hidden folder `7793` · USB initials `MW` ·
rogue SSID `NIMBUS_5ecure` @ Desk 14 · insider `EXT-4471` · cloud bucket `frost-vault-882` (→ `882`) ·
AI override `AURORA` · kill passphrase `NORTHSTAR`. **Ransomware:** BLACKFROST. **Project:** FROST.

**All 16 awareness topics covered:** Password Security · MFA · Physical Security · Tailgating · Visitor
Management · Network Security · Rogue Wi-Fi · Phishing · Social Engineering · USB Security · Data
Classification · Cloud Security · Device Security · Incident Reporting · AI Security · Insider Threats.

**Zones:** A = Reception · B = Alex's Workstation (the PC) · C = SOC Wall · D = Evidence Shelf · E =
Finale (on the PC). Players move left-to-right A→D, finishing at the PC.

---

## 5. Key design decisions & rationale (decisions log)

These are the choices made across the design conversations, recorded so the *why* isn't lost.

**Experience & structure**
- Built as a **detective mystery**, not training. Lessons are the *mechanism* that unlocks each step; no
  quiz questions, no required prior knowledge, no long reading. Constant **physical ↔ digital** alternation.
- A **locked computer** is the central mystery (physical access → password → MFA earns entry).
- **45:00 visible countdown** for urgency; single triumphant kill-switch finish.
- **Soft-fail** design: if the clock runs out, the host offers +5 min overtime or a reveal — every team
  still gets the win moment and the debrief.

**Platform / tech**
- **Plain static HTML/CSS/JS** "NIMBUS Secure Terminal" — runs fully **offline from `file://`** (optional
  `python -m http.server`). No build, no framework, no server required.
- State via **`sessionStorage`** so it **auto-resets when the browser relaunches**; plus `reset.bat` and
  host hotkey. `file://` robustness: config as a JS global (no CORS/fetch), `try/catch` with an in-memory
  `MEM` fallback if storage is blocked.
- **Dark SOC theme** on screen — accent cyan `#2ec6ff`, purple `#7c5cff`, ok green `#34d399`, bad red `#ff5470`.
- **AI puzzle** uses a **scripted keyword-matched bot** (zero dependencies) by default; optional local-LLM
  (Ollama) upgrade documented but not required.
- **Host hotkeys:** **Ctrl+Alt+R** = reset room · **Ctrl+Alt+S** = host skip / unlock all steps. Chose
  Ctrl+Alt (not Ctrl+Shift+R) to avoid the browser hard-reload conflict.
- **Browser lockdown** documented (Edge kiosk vs Windows Assigned Access); an in-app **Evidence Viewer**
  means players never need OS/desktop access, keeping the machine safe and resettable.

**Printables**
- Chose **light-theme** print HTML (realistic office documents + saves ink) over the dark UI theme.
  Shared `print.css`: `@page{size:A4;margin:0}`, `print-color-adjust:exact`; screen shows white "sheets"
  on grey with a **Print** button + grey host-instruction toolbar (both hidden via `@media print`).
- Brand teal `#0b6e99` / cyan `#13a3c7`. Answer-bearing props are flagged in host-only spoiler notes.
- **AURORA / NORTHSTAR are kept on-screen only** (never printed) so the two most important secrets can't
  leak from a prop. The Confidential cloud-bucket folder (`882`) is **gated behind the correct accusation**
  to protect the twist.
- EXIF/photo-metadata clue is delivered three ways for reliability: in-app evidence viewer, a
  `parking_lot_metadata.txt` fallback, and optional real-EXIF instructions.

---

## 6. Complete file index

All paths are workspace-relative. Items marked ⚠️ contain spoilers (host-only).

**Project hub**
- [README.md](README.md) — landing page, phase tracker, "how to run the room"
- [PROJECT-RECORD.md](PROJECT-RECORD.md) — ⚠️ this file

**Phase 1 — Design** (`Phase-1-Design/`)
- [00-Phase-1-Overview.md](Phase-1-Design/00-Phase-1-Overview.md)
- [01-Storyline.md](Phase-1-Design/01-Storyline.md)
- [02-Room-Layout.md](Phase-1-Design/02-Room-Layout.md)
- [03-Puzzle-Flow-Overview.md](Phase-1-Design/03-Puzzle-Flow-Overview.md)
- [04-Platform-Recommendation.md](Phase-1-Design/04-Platform-Recommendation.md)
- [05-High-Level-Architecture.md](Phase-1-Design/05-High-Level-Architecture.md)

**Phase 2 — Puzzles** (`Phase-2-Puzzles/`)
- [00-Phase-2-Overview-and-Answer-Key.md](Phase-2-Puzzles/00-Phase-2-Overview-and-Answer-Key.md) ⚠️ master key
- [01-Puzzle-1-The-Tailgate.md](Phase-2-Puzzles/01-Puzzle-1-The-Tailgate.md)
- [02-Puzzle-2-The-Sticky-Trap.md](Phase-2-Puzzles/02-Puzzle-2-The-Sticky-Trap.md)
- [03-Puzzle-3-Second-Factor.md](Phase-2-Puzzles/03-Puzzle-3-Second-Factor.md)
- [04-Puzzle-4-The-Bait.md](Phase-2-Puzzles/04-Puzzle-4-The-Bait.md)
- [05-Puzzle-5-The-Drop.md](Phase-2-Puzzles/05-Puzzle-5-The-Drop.md)
- [06-Puzzle-6-Ghost-Signal.md](Phase-2-Puzzles/06-Puzzle-6-Ghost-Signal.md)
- [07-Puzzle-7-The-Trusted-One.md](Phase-2-Puzzles/07-Puzzle-7-The-Trusted-One.md)
- [08-Puzzle-8-The-Confidant.md](Phase-2-Puzzles/08-Puzzle-8-The-Confidant.md)
- [09-Finale-Kill-BLACKFROST.md](Phase-2-Puzzles/09-Finale-Kill-BLACKFROST.md)

**Phase 3 — Computer setup** (`Phase-3-Computer-Setup/`)
- [00-Computer-Setup-Guide.md](Phase-3-Computer-Setup/00-Computer-Setup-Guide.md) — build / run / reset / lockdown
- [launch.bat](Phase-3-Computer-Setup/launch.bat) · [reset.bat](Phase-3-Computer-Setup/reset.bat)
- `NIMBUS-Secure-Terminal/` (the offline web app, 12 pages):
  [index.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/index.html) ·
  [login.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/login.html) ·
  [mfa.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/mfa.html) ·
  [desktop.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/desktop.html) ·
  [mail.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/mail.html) ·
  [files.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/files.html) ·
  [network.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/network.html) ·
  [assistant.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/assistant.html) ·
  [killswitch.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/killswitch.html) ·
  [win.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/win.html) ·
  [fail.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/fail.html) ·
  [timer.html](Phase-3-Computer-Setup/NIMBUS-Secure-Terminal/timer.html)
- App assets: `NIMBUS-Secure-Terminal/assets/css/nimbus.css`, `assets/js/config.js` ⚠️, `assets/js/state.js`
- Host files: `Host-Files/NIMBUS_USB/` (`loader.txt`, `exfil_list.csv`), `Host-Files/Evidence/`
  (`badge_access.csv`, `parking_lot_metadata.txt`), [README-HOST-FILES.txt](Phase-3-Computer-Setup/Host-Files/README-HOST-FILES.txt) ⚠️

**Phase 4 — Printables** (`Phase-4-Printables/`)
- [00-Printables-Guide.md](Phase-4-Printables/00-Printables-Guide.md) — what to print, copies, placement map
- `assets/print.css` — shared light-theme print stylesheet
- 01–19 print-ready HTML: visitor policy/log, passphrase poster, desk props, authenticator+MFA,
  spot-the-phish, phishing email, network diagram, Wi-Fi survey, badge log, contractor HR binder, data
  classification, cloud-exfil alert, red-herring Riley, folder labels, suspect badges, parking-lot photo,
  Alex's notes, room branding. (Full list in the guide above.) Several are ⚠️ answer-bearing.

**Phase 5 — Host guides** (`Phase-5-Host-Guides/`)
- [00-Host-Guide-Overview.md](Phase-5-Host-Guides/00-Host-Guide-Overview.md) — prep, roles, run-of-show
- [01-Facilitator-Script.md](Phase-5-Host-Guides/01-Facilitator-Script.md) — intro, prompts, win/fail endings
- [02-Hint-Ladder.md](Phase-5-Host-Guides/02-Hint-Ladder.md) ⚠️ — 3-tier hints for every puzzle
- [03-Reset-Checklist.md](Phase-5-Host-Guides/03-Reset-Checklist.md) — between-group reset ≤10 min
- [04-Debrief-Guide.md](Phase-5-Host-Guides/04-Debrief-Guide.md) — map puzzles → real lessons
- [05-Host-Quick-Reference.md](Phase-5-Host-Guides/05-Host-Quick-Reference.md) ⚠️ — one-page cheat card

---

## 7. How to run the room

**First-time build order:** Phase 3 (set up the computer) → Phase 4 (print & place all props) → Phase 5
(read the facilitator script; test once using **Ctrl+Alt+S** to skip ahead) → reset → ready for players.

**Each session:** host follows [00-Host-Guide-Overview.md](Phase-5-Host-Guides/00-Host-Guide-Overview.md),
keeps [05-Host-Quick-Reference.md](Phase-5-Host-Guides/05-Host-Quick-Reference.md) in hand, runs the intro
from the facilitator script, gives hints from the ladder, ends on win/soft-fail, then debriefs.

**Reset between groups:** run `reset.bat` (or **Ctrl+Alt+R**), then re-place physical props per
[03-Reset-Checklist.md](Phase-5-Host-Guides/03-Reset-Checklist.md). Target ≤10 min.

**Host controls:** **Ctrl+Alt+R** reset · **Ctrl+Alt+S** skip/unlock. `sessionStorage` also auto-clears
on browser relaunch.

---

## 8. Original requirements (the brief)

- A **30–60 minute escape room experience for teams of 3–6 players**.
- Must **feel like a real escape room** — explicitly **NOT** a cybersecurity quiz, workshop, CTF, hacking
  lab, or training course.
- Cover **16 security-awareness topics** (listed in §4) woven invisibly into puzzles.
- Delivered in **5 approval-gated phases**; phases built one at a time, never all at once.
- Assumptions (adjustable): English content · one room (~3×4 m+) · one dedicated Windows PC · 45-min
  target with visible countdown · facilitator present to give hints.

---

## 9. Outstanding / future items

- ✏️ **Printable tweaks (pending):** the owner plans to request alterations to some Phase 4 printables.
  When specifics arrive, edit the relevant files in [Phase-4-Printables](Phase-4-Printables) and update
  [00-Printables-Guide.md](Phase-4-Printables/00-Printables-Guide.md) if placement changes.
- 🌐 Optional enhancements noted but not required: real-EXIF photo, local-LLM (Ollama) AI upgrade,
  Windows Assigned-Access kiosk, localisation to other languages.
- 🧪 The full chain was traced for consistency on paper but **not** run-tested in a live browser — do one
  end-to-end playtest before the first real group.

---

*End of record. This file plus the phase folders are the complete, self-contained project — safe to
archive, copy, or hand to another facilitator.*
