# Phase 1 — Design Overview & Blueprint

**Project:** BREACH PROTOCOL — Cybersecurity Escape Room
**Phase 1 deliverables:** Storyline · Room layout · Puzzle flow overview · Recommended platform · High-level architecture

This file is the executive summary. The five topics each have their own detailed file (`01`–`05`).
Read this first, then dive into the numbered documents.

---

## 1. The concept in one paragraph

Players are the after-hours **Incident Response Team** at *NIMBUS Cloud Solutions*. A senior
security analyst, **Alex Mercer**, discovered a breach in progress — then vanished, leaving a
deliberate trail of clues for whoever came next. A ransomware payload named **BLACKFROST** is
scheduled to encrypt every client's data when a countdown hits zero. Players must get into Alex's
locked workstation, follow the evidence, expose the **insider** who planted the malware, and enter
the **kill-switch code** to stop the breach before time runs out. The room constantly alternates
between *physical clue-solving* and *computer investigation*, and each puzzle teaches one security
awareness lesson by making that lesson the thing that unlocks the next step.

---

## 2. What makes it feel like a real escape room (not training)

- **A locked computer as the central mystery.** You can see Alex's terminal, but it's sealed behind
  a login. Getting in is a multi-step earn (physical access → password → MFA), not a quiz.
- **Story revealed through evidence, not exposition.** Players *find out* what happened by reading
  emails, badge logs, photos, and notes — like detectives, never like students.
- **Tactile discovery.** Hidden compartments, UV ink, taped-under-the-desk USB sticks, sealed
  "recovery code" envelopes, a network-diagram poster with one wrong letter.
- **A ticking clock and a single triumphant finish.** The BLACKFROST countdown creates real urgency
  and a clean win moment when the kill-switch code lands.
- **Lessons are invisible.** Nobody is told "this is about phishing." They just notice that one email
  is fake — and that noticing is the key.

---

## 3. The eight puzzles + finale (the chain)

Each link unlocks the next. Full detail is in `03-Puzzle-Flow-Overview.md`; complete designs come in
Phase 2.

| # | Puzzle | Mode | Security topic(s) | Unlocks |
|---|---|---|---|---|
| 1 | **The Tailgate** | Physical | Physical security · Tailgating · Visitor management | Workstation cabinet key |
| 2 | **The Sticky Trap** | Physical→PC | Password security | PC username + passphrase |
| 3 | **Second Factor** | Physical→PC | Multi-Factor Authentication | Desktop access |
| 4 | **The Bait** | PC | Phishing · Social engineering | Hidden-folder code |
| 5 | **The Drop** | Physical→PC | USB security · Device security | Exfil evidence + clue |
| 6 | **Ghost Signal** | Physical→PC | Network security · Rogue Wi-Fi | Suspect location clue |
| 7 | **The Trusted One** | Physical+PC | Insider threats · Data classification · Cloud security | Insider's identity + ID |
| 8 | **The Confidant** | PC | AI security (prompt injection) | Kill-switch console location |
| 🏁 | **Kill BLACKFROST** | PC | Incident reporting | **WIN** |

**Topic coverage (all 16 required):** Password Security · MFA · Physical Security · Tailgating ·
Visitor Management · Network Security · Rogue Wi-Fi · Phishing · Social Engineering · USB Security ·
Data Classification · Cloud Security · Device Security · Incident Reporting · AI Security · Insider Threats.

---

## 4. Recommended platform (summary)

**Hybrid: a Windows 10/11 host running a self-contained local "NIMBUS Secure Terminal" website
(HTML/CSS/JS) in full-screen kiosk mode, alongside a small number of real planted files.**

Why this wins (full comparison in `04-Platform-Recommendation.md`):
- The web "terminal" gives you a **themeable, scriptable, perfectly resettable** login → MFA →
  desktop → email → kill-switch flow without ever risking the real OS lock-out.
- Windows provides familiar realism (real desktop, real folders, EXIF photo metadata, a real file
  the USB "contains").
- One-click reset: close the browser tab, restore one folder. No reimaging between groups.
- Moderate technical skill is enough — no servers required (optional one-line `python -m http.server`).

---

## 5. Room at a glance

Five zones guide players left-to-right through the story (full map in `02-Room-Layout.md`):

```
 ┌──────────────────────────────────────────────────────────────────────┐
 │  ZONE A            ZONE B             ZONE C            ZONE D         │
 │  Reception        Alex's Desk        SOC Wall         Evidence Shelf  │
 │  (entry/locks)    (the PC)           (network/Wi-Fi)  (USB/files)     │
 │                                                                       │
 │                         ZONE E — Kill-Switch Finale (on the PC)        │
 └──────────────────────────────────────────────────────────────────────┘
```

- **Zone A — Reception:** visitor log, badge poster, lockbox → physical security puzzles.
- **Zone B — Alex's Workstation:** the PC, desk drawers, sticky notes, authenticator prop → password + MFA.
- **Zone C — SOC Wall:** network-diagram poster, Wi-Fi survey, incident board → network/rogue Wi-Fi.
- **Zone D — Evidence Shelf:** binders, sealed envelopes, the planted USB, "Confidential" folders → USB, data classification, insider logs.
- **Zone E — Finale:** the BLACKFROST countdown + kill-switch console (a page on the PC).

---

## 6. How a session runs (timeline)

| Time | Beat |
|---|---|
| 0:00 | Host presses **Start Mission** after the intro briefing; countdown starts at 45:00 |
| 0:00–0:10 | Zone A: break in to the workstation (Puzzles 1–2) |
| 0:10–0:20 | Log in with MFA, discover the breach (Puzzles 3–4) |
| 0:20–0:35 | Investigate USB, network, and logs (Puzzles 5–7) |
| 0:35–0:43 | Defeat the tampered AI, reach the kill switch (Puzzle 8) |
| 0:43–0:45 | Enter the code, stop BLACKFROST, reveal the truth (Finale) |

---

## 7. Design guardrails honored

- ✅ No quiz questions, no required prior knowledge — everything is solvable from clues.
- ✅ No long reading tasks — evidence is short, visual, and scannable.
- ✅ Constant alternation between physical and digital.
- ✅ Every security topic is the **mechanism** that solves a puzzle, never a lecture.
- ✅ Fully resettable between groups with a documented checklist (Phase 5).

---

## 8. What I need from you to proceed

Approve Phase 1 (or request changes to story, tone, topic emphasis, length, or room constraints).
On approval I'll produce **Phase 2 — Complete Puzzle Designs**, giving each of the 9 stages the full
15-point specification (name, story purpose, topic, learning objective, setup, materials, exact
layout, discovery, solve, solution, 3 hints, reset, and solve-time).
