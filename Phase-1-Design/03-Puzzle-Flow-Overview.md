# 03 — Puzzle Flow Overview

> High-level map of the puzzle chain: what each puzzle is, why it exists in the story, the security
> lesson it hides, and exactly what it unlocks. **Full 15-point designs (setup, layout, solution,
> three hints, reset, etc.) are delivered in Phase 2** — this file is the blueprint that proves the
> chain holds together.

---

## The golden rule of the chain

> **Every puzzle outputs the key to the next.** No puzzle can be solved early, none can be skipped,
> and the security lesson is always the *mechanism* of the solution — not a question about it.

The chain alternates **Physical → Digital → Physical → Digital** so players are never stuck doing one
kind of task for long.

---

## Master chain table

| # | Puzzle | Mode | Security topic(s) | What it unlocks (the "key") |
|---|---|---|---|---|
| 1 | **The Tailgate** | 🔲 Physical | Physical Security · Tailgating · Visitor Management | 4-digit lockbox → **desk key** |
| 2 | **The Sticky Trap** | 🔲→💻 | Password Security | **Username + passphrase** for the PC |
| 3 | **Second Factor** | 🔲→💻 | Multi-Factor Authentication | **6-digit code** → desktop unlocks |
| 4 | **The Bait** | 💻 Digital | Phishing · Social Engineering | **Hidden-folder code** |
| 5 | **The Drop** | 🔲→💻 | USB Security · Device Security | **Exfil path + suspect initials** |
| 6 | **Ghost Signal** | 🔲→💻 | Network Security · Rogue Wi-Fi | **Suspect location / desk number** |
| 7 | **The Trusted One** | 🔲+💻 | Insider Threats · Data Classification · Cloud Security | **Insider name + contractor ID** |
| 8 | **The Confidant** | 💻 Digital | AI Security (prompt injection) | **Kill-switch console + kill phrase** |
| 🏁 | **Kill BLACKFROST** | 💻 Digital | Incident Reporting | **WIN** (3-fragment code) |

🔲 = physical · 💻 = computer · 🔲→💻 = a physical find that's used on the PC.

---

## Stage-by-stage (story + lesson + dependency)

### Puzzle 1 — "The Tailgate"  ⏱ ~6 min
- **Story purpose:** Players must get *physical access* to Alex's locked workstation — just like the
  attacker had to get physical access to NIMBUS's secure area.
- **Lesson (the mechanism):** A **visitor log** and **badge poster** reveal that one "visitor" entered
  without signing out / without an escort — a **tailgater**. Spotting the anomaly yields the lockbox
  combination.
- **Input:** nothing (entry point). **Output:** desk cabinet **key** + Alex's first note ("Start at my
  screen. The sticky note lies.").

### Puzzle 2 — "The Sticky Trap"  ⏱ ~6 min
- **Story purpose:** Log in as Alex. The decoy sticky note ("Summer2023!") is the password the attacker
  *expected* to find — it's expired and wrong.
- **Lesson:** Sticky-note passwords are a trap. The **real** credential is a **4-random-word
  passphrase** assembled from four objects on the desk (per the "How to build a strong passphrase"
  poster). Teaches passphrase strength + why visible passwords fail.
- **Input:** desk access (key from P1). **Output:** **username + passphrase** entered into the NST
  login page.

### Puzzle 3 — "Second Factor"  ⏱ ~4 min
- **Story purpose:** The password alone isn't enough — Alex protected her account properly.
- **Lesson:** **MFA = something you know + something you have.** The login demands a 6-digit code; the
  "something you have" is the **authenticator token prop** from the drawer (a printed code wheel /
  local TOTP page / sealed recovery-code envelope as backup).
- **Input:** valid password (P2). **Output:** **6-digit code** → the desktop unlocks; investigation begins.

### Puzzle 4 — "The Bait"  ⏱ ~6 min
- **Story purpose:** First evidence — how the attacker got in. Players open Alex's email and find the
  phishing message that compromised Dana.
- **Lesson:** Spot the **phish**: spoofed sender domain, urgent tone, mismatched link. Identifying the
  fake email (vs. several legit ones) reveals a code hidden in its details (e.g., the fake domain →
  a folder name).
- **Input:** desktop access (P3). **Output:** **code** that unlocks a hidden folder / next clue.

### Puzzle 5 — "The Drop"  ⏱ ~6 min
- **Story purpose:** The attacker's tools came in on a USB stick left for an unwitting employee.
- **Lesson:** **USB-drop attack.** A physical USB (taped under the shelf / shown in a "parking lot"
  photo) plugs into the PC's **evidence viewer**, revealing a malware loader + exfil script whose
  metadata exposes the attacker's **initials** and a folder path. (Framed as forensic evidence, with a
  clear "never plug in unknown USBs" beat in the debrief.)
- **Input:** hidden folder (P4) points to the USB. **Output:** **exfil path + initials** clue.

### Puzzle 6 — "Ghost Signal"  ⏱ ~6 min
- **Story purpose:** How the attacker harvested more credentials.
- **Lesson:** **Rogue Wi-Fi.** On the **network-diagram poster** + **Wi-Fi survey**, one SSID mimics the
  corporate network (e.g., `NIMBUS_Secure` vs `NlMBUS_Secure`). Its plotted location on the map points
  to a specific desk/area, narrowing the suspect.
- **Input:** initials/path (P5) tell players which network log to inspect. **Output:** **suspect
  location / desk number.**

### Puzzle 7 — "The Trusted One"  ⏱ ~8 min  *(the twist)*
- **Story purpose:** Unmask the insider — and clear the innocent.
- **Lesson:** **Insider threats + data classification + cloud.** Cross-reference **badge access logs**
  (PC CSV) × **visitor/contractor binder** × which **Confidential** files were touched × the rogue-AP
  location. The obvious suspect **Riley** is cleared (badge deactivated before the attack); the only
  identity matching *every* clue is contractor **Marcus Webb**. His exfil went to a personal **cloud
  bucket**.
- **Input:** location (P6) + evidence from P4–P5. **Output:** **insider name + contractor ID** (a
  kill-switch fragment).

### Puzzle 8 — "The Confidant"  ⏱ ~5 min
- **Story purpose:** The last gate to the kill switch is NIMBUS's helpdesk **AI assistant** — which the
  attacker tampered with to mislead responders ("Don't trust the assistant," Alex warned).
- **Lesson:** **AI security / prompt injection.** The bot keeps giving wrong directions until players
  feed it Alex's **override phrase** (found earlier). It then reveals the kill-switch console location
  and the final code fragment.
- **Input:** Alex's phrase + insider ID (P7). **Output:** **kill-switch console access + kill phrase.**

### Finale — "Kill BLACKFROST"  ⏱ ~4 min
- **Story purpose:** Stop the ransomware before the timer ends.
- **Lesson:** **Incident reporting** — players assemble the **three-fragment kill-switch code**
  (contractor ID + kill phrase + data fragment) and confirm the correct response actions (isolate,
  report, preserve evidence). Entering the code halts BLACKFROST → **WIN** + Alex's closing reveal.
- **Input:** all prior outputs. **Output:** **victory.**

---

## Dependency graph (why nothing can be skipped)

```
[P1 Tailgate]──key──►[P2 Sticky Trap]──pass──►[P3 MFA]──desktop──►[P4 Phishing]
                                                                       │ folder code
                                                                       ▼
                                                                  [P5 USB Drop]
                                                                       │ initials/path
                                                                       ▼
                                                                  [P6 Rogue Wi-Fi]
                                                                       │ location
                                                                       ▼
                                                     [P7 Insider ID]  ◄── badge logs + Confidential files
                                                                       │ name + contractor ID  (Riley cleared)
                                                                       ▼
                                                                  [P8 AI override]
                                                                       │ kill phrase + console
                                                                       ▼
                                                            [🏁 Kill BLACKFROST]
                                                            ID + phrase + data fragment → WIN
```

---

## Pacing & difficulty curve

| Phase of game | Puzzles | Feel | Target time |
|---|---|---|---|
| **Break-in** | 1–3 | Fast wins, builds confidence | ~14 min |
| **Investigation** | 4–6 | Meatier, "detective" mode | ~18 min |
| **The reveal** | 7–8 | Hardest thinking + the twist | ~13 min |
| **Finale** | 🏁 | Cathartic race against the clock | ~4 min |

- **Difficulty ramps gently:** P1–P3 are quick to hook the team; P7 is the hardest (multi-source
  cross-reference); the finale is easy *if* you've solved everything (pure payoff).
- **Parallelizable middle:** P4, P5, and P6 can be partly worked in parallel by sub-teams (great for
  groups of 5–6), but each still feeds the single P7 bottleneck so the team must regroup — encouraging
  collaboration.
- **Anti-frustration valves:** the sealed "MFA Recovery Codes" envelope and the 3-hint ladder (Phase 5)
  guarantee no team hard-stalls; the host can also nudge the AI (P8) to be more helpful.

---

## Topic-to-puzzle coverage matrix (all 16 required topics)

| Security topic | Where it lives |
|---|---|
| Password Security | P2 |
| Multi-Factor Authentication | P3 |
| Physical Security | P1 |
| Tailgating | P1 |
| Visitor Management | P1 |
| Network Security | P6 |
| Rogue Wi-Fi | P6 |
| Phishing | P4 |
| Social Engineering | P4 (+ threaded through P1, P8) |
| USB Security | P5 |
| Data Classification | P7 |
| Cloud Security | P7 |
| Device Security | P5 (+ P2 lock-screen beat) |
| Incident Reporting | Finale |
| AI Security | P8 |
| Insider Threats | P7 (whole-story spine) |

---

## What Phase 2 will add for each puzzle

For all 9 stages above, Phase 2 delivers the full required spec: **Puzzle Name · Story Purpose ·
Security Topic · Learning Objective · Setup Instructions · Materials Needed · Exact Puzzle Layout ·
How Players Discover It · How Players Solve It · Solution · Hint 1 · Hint 2 · Hint 3 · Reset
Instructions · Estimated Solve Time** — plus the exact codes, passphrases, and artifact text.
