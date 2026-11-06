# Finale — "Kill BLACKFROST"

| | |
|---|---|
| **Mode** | Computer |
| **Position in chain** | After P8 (console + NORTHSTAR) → **WIN** |
| **Output** | Stop the ransomware → victory + Alex's reveal + debrief springboard |

---

### 1. Puzzle Name
**Kill BLACKFROST** — *"Two minutes. Three keys. End it."*

### 2. Story Purpose
The climax. With the insider exposed and the console unlocked, players must take the **correct incident
response actions** and enter the **three-fragment kill-switch code** before the countdown hits zero.
Success neutralizes BLACKFROST, locks out Marcus Webb, and brings Alex back safely.

### 3. Security Topic
**Incident Reporting** / response (the right first actions in a breach) — capstone that ties every prior
lesson together.

### 4. Learning Objective
Players learn the correct **first response** to an incident: **isolate** affected systems, **preserve
evidence**, and **report** to the security team/management — *not* pay the ransom, go silent, or panic.
They also see that good response is a **team effort drawing on every earlier clue**.

### 5. Setup Instructions
1. Build `killswitch.html` with: a live **BLACKFROST countdown**, a **2-step** form (IR checklist →
   3-fragment code), and **win/fail** routing.
2. Mirror the countdown to the room's **second display/projector**.
3. Pre-set the timer to the room length (default **45:00**, configurable). The console becomes usable
   only after Puzzle 8.

### 6. Materials Needed
- `killswitch.html`, `win.html`, `fail.html` (Phase 3)
- Optional second display/projector for the countdown
- (All three fragments come from earlier puzzles — no new props.)

### 7. Exact Puzzle Layout

**Step 1 — Incident Response checklist** (multi-select; teaches reporting):
> **Before arming the kill switch, choose the correct first actions:**
> - ☑ **Isolate** the affected systems
> - ☑ **Preserve** evidence and logs
> - ☑ **Report** to the Security/IR team & management
> - ☐ Pay the ransom *(wrong)*
> - ☐ Shut everything down and tell no one *(wrong)*
> - ☐ Email all clients in a panic *(wrong)*
>
> Correct trio → *"Response plan accepted. Kill switch armed."* Wrong pick → gentle correction, retry.

**Step 2 — Three-fragment kill code** (forces use of P7 + P8 outputs):
> | Field | Source | Answer |
> |---|---|---|
> | Insider Contractor ID | Puzzle 7 | **4471** |
> | Exfil Cloud Bucket # | Puzzle 7 | **882** |
> | Kill-switch Passphrase | Puzzle 8 | **NORTHSTAR** |
>
> Submit → if all correct **and** time remains → countdown **freezes** at a few seconds → `win.html`.

**`win.html` — victory + reveal (Alex's closing message):**
> *"BLACKFROST neutralized. Marcus Webb's access revoked. Client data safe.*
> *The intruder wasn't a hacker in a hoodie — it was our **IT contractor**. A badge we trusted without review,
> access we never reviewed, trust he never earned. You didn't blame the easy target; you followed the
> evidence. That's real incident response. I'm safe — I went dark because I couldn't tell who was
> watching. Thank you. — Alex Mercer."*
> 🏆 **ROOM COMPLETE** — *time remaining: \[mm:ss]*.

**`fail.html` — soft fail (timer hit 0):** dramatic "BLACKFROST deployed" screen, then host options:
*grant 5-minute overtime* or *reveal solution + go to debrief*. Failure is theatrical, never punishing.

### 8. How Players Discover It
Puzzle 8's freed assistant hands players the **"Open Kill-Switch Console"** button and the passphrase,
dropping them directly onto `killswitch.html` with the countdown front and center.

### 9. How Players Solve It
Players select the three correct IR actions (isolate / preserve / report) to arm the console, then
enter the three fragments gathered across the game — **4471**, **882**, **NORTHSTAR** — and submit
before time runs out.

### 10. Solution
IR checklist = **Isolate + Preserve + Report**; code = **ID 4471 / Bucket 882 / Passphrase NORTHSTAR**
→ BLACKFROST stopped → `win.html` + Alex's reveal → host debrief.

### 11. Hint 1 (nudge)
*"Before the code, the console asks what you'd actually *do* in a breach. Think calm and responsible —
contain it, keep the evidence, tell the right people. Avoid anything that looks like panic or paying
off criminals."*

### 12. Hint 2 (method)
*"The code has three parts you've already found: the **contractor's ID number**, the **cloud bucket
number**, and the **passphrase the assistant gave you**."*

### 13. Hint 3 (all but answer)
*"Check: Isolate + Preserve evidence + Report. Then enter **4471**, **882**, and **NORTHSTAR**. Hit
submit before the clock dies."*

### 14. Reset Instructions
Host reset hotkey reloads `killswitch.html`, resets the countdown to the configured length, and re-locks
it behind Puzzle 8. No physical reset. (~15 sec.)

### 15. Estimated Solve Time
**~4 minutes** (pure payoff if all fragments are in hand).

---

## Debrief bridge (full version in Phase 5)
On `win.html`, the host runs a 5-minute walkthrough mapping each puzzle to its real-world behavior:
front-door/tailgating (P1) · passphrases (P2) · MFA (P3) · phishing & reporting (P4) · USB drops (P5) ·
rogue Wi-Fi (P6) · insider threats / classification / cloud (P7) · AI manipulation (P8) · incident
response (Finale). End on the headline: **"The biggest risk is the access we never review — including
the people we trust."**
