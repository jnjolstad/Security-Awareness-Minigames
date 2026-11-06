# BREACH PROTOCOL

### A Cybersecurity Escape Room for Security Awareness Month

> *"Somewhere in this room, an analyst left you everything you need to stop a breach.
> The clock is already running."*

**BREACH PROTOCOL** is a 30–60 minute immersive escape room for teams of **3–6 players**.
Players step into the after-hours office of a missing security analyst at *NIMBUS Cloud
Solutions*, follow the trail of evidence they left behind, uncover an insider-driven
ransomware attack, and race to enter the kill-switch code before the malware detonates.

No cybersecurity knowledge is required. Every security lesson is hidden **inside** a puzzle —
solving the puzzle *is* learning the lesson.

---

## At a glance

| Attribute | Value |
|---|---|
| Players | 3–6 (works down to 2, up to 8 with a larger room) |
| Duration | 45 minutes target (30 min fast teams / 60 min hard cap) |
| Difficulty | Medium — no technical background needed |
| Theme | Corporate cyber-incident / detective investigation |
| Platform | Hybrid: Windows host + local web "terminal" + physical props |
| Win condition | Identify the insider and enter the BLACKFROST kill-switch code |
| Security topics | 16 awareness topics embedded across 8 puzzles + finale |

---

## Project structure

```
Security Awareness Month/
├─ README.md                     ← you are here (project hub + phase tracker)
├─ PROJECT-RECORD.md             ← ⚠️ host-only: full decisions log, answer chain, file index
├─ Phase-1-Design/               ← design & blueprint (approved)
│  ├─ 00-Phase-1-Overview.md
│  ├─ 01-Storyline.md
│  ├─ 02-Room-Layout.md
│  ├─ 03-Puzzle-Flow-Overview.md
│  ├─ 04-Platform-Recommendation.md
│  └─ 05-High-Level-Architecture.md
├─ Phase-2-Puzzles/              ← THIS DELIVERY (full puzzle designs)
│  ├─ 00-Phase-2-Overview-and-Answer-Key.md   ⚠️ host-only / spoilers
│  ├─ 01-Puzzle-1-The-Tailgate.md
│  ├─ 02-Puzzle-2-The-Sticky-Trap.md
│  ├─ 03-Puzzle-3-Second-Factor.md
│  ├─ 04-Puzzle-4-The-Bait.md
│  ├─ 05-Puzzle-5-The-Drop.md
│  ├─ 06-Puzzle-6-Ghost-Signal.md
│  ├─ 07-Puzzle-7-The-Trusted-One.md
│  ├─ 08-Puzzle-8-The-Confidant.md
│  └─ 09-Finale-Kill-BLACKFROST.md
├─ Phase-3-Computer-Setup/       ← THIS DELIVERY (working terminal + host setup)
│  ├─ 00-Computer-Setup-Guide.md             ← step-by-step build/run/reset
│  ├─ launch.bat · reset.bat                 ← one-click start / between-group reset
│  ├─ NIMBUS-Secure-Terminal/                ← the offline web "terminal" (12 pages)
│  │  └─ assets/  (nimbus.css · config.js ⚠️spoilers · state.js)
│  └─ Host-Files/                            ← real evidence + USB contents
├─ Phase-4-Printables/           ← THIS DELIVERY (print-ready props & artifacts)
│  ├─ 00-Printables-Guide.md                 ← what to print, copies, placement map
│  ├─ 01–19 *.html                           ← posters, logs, badges, labels, notes
│  └─ assets/print.css                       ← shared print styling
└─ Phase-5-Host-Guides/          ← THIS DELIVERY (run the room)
   ├─ 00-Host-Guide-Overview.md               ← prep, roles, run-of-show
   ├─ 01-Facilitator-Script.md                ← intro, prompts, win/fail endings
   ├─ 02-Hint-Ladder.md                       ← all 3-tier hints ⚠️spoilers
   ├─ 03-Reset-Checklist.md                   ← between-group reset ≤ 10 min
   ├─ 04-Debrief-Guide.md                     ← map puzzles → real-world lessons
   └─ 05-Host-Quick-Reference.md              ← one-page cheat card ⚠️spoilers
```

---

## Delivery phases

The project is delivered in **5 approval-gated phases**. Each phase stops for your sign-off.

| Phase | Contents | Status |
|---|---|---|
| **Phase 1** | Storyline · Room layout · Puzzle flow · Platform · Architecture | ✅ Approved |
| **Phase 2** | Complete design of all 8 puzzles + finale (15-point spec each) | ✅ Approved |
| **Phase 3** | Working web "terminal" + real host files + setup/reset guide | ✅ Approved |
| **Phase 4** | All printable artifacts & props (posters, logs, badges, labels…) | ✅ Approved *(printable tweaks pending)* |
| **Phase 5** | Host guide · Facilitator script · Hint ladder · Reset · Debrief | ✅ **Delivered — project complete** |

---

## How to run the room

Everything is built. To run a session, the host opens **`Phase-5-Host-Guides/00-Host-Guide-Overview.md`**
and follows it: it links the setup (Phase 3), the print checklist (Phase 4), the facilitator script, hint
ladder, reset checklist, and debrief. Keep the one-page **`05-Host-Quick-Reference.md`** in hand during play.

**Build order for a first-time setup:** Phase 3 (computer) → Phase 4 (print & place props) → Phase 5
(read the script, test once with **Ctrl+Alt+S** to skip ahead). Then reset and you're ready for players.

> **Assumptions made (adjustable at the approval gate):** English-language content · one room
> (~3×4 m or larger) · one dedicated Windows PC · a 45-minute target with a visible countdown ·
> facilitator/host present to give hints. Tell me if any of these should change.
