# Phase 2 — Overview & Master Answer Key

> The single source of truth for every code, name, artifact, and answer in BREACH PROTOCOL.
> Each puzzle file (`01`–`09`) gives the full 15-point design. This file keeps them consistent and is
> what Phase 3 (`assets/js/config.js`) and Phase 4 (printables) build from.

> ⚠️ **HOST-ONLY / SPOILERS.** Do not print or display this file in the room.

---

## 1. Canonical facts (names, IDs, systems)

| Element | Value | Notes |
|---|---|---|
| Company | **NIMBUS Cloud Solutions** | motto "Your Data. Always Up." |
| Player team | After-Hours Incident Response Team | — |
| Hero (missing) | **Alex Mercer** — Senior Security Analyst | login `a.mercer` |
| Insider / villain | **Marcus Webb** — IT Support Contractor | ID **EXT-4471**, **Desk 14** (Contractor Bench) |
| Red herring | **Riley Tran** — terminated Sysadmin | badge **EMP-2087**, **DEACTIVATED 14 days ago** |
| Bystander (phished) | **Dana Cole** — Helpdesk Technician | badge **EMP-3310** |
| Decoy suspect | **Priya Nair** — Network Engineer | badge **EMP-4185**, Desk 17 — daytime maintenance only (09:40), **absent at 02:30** |
| Decoy suspect | **Tom Baxter** — Facilities Contractor | badge **EXT-5012**, Desk 03 — **Loading Bay / Facilities only**, never SOC/Server Room |
| Generic tailgater | **J. Price** — "Delivery" | visitor badge **V-2071** (Puzzle 1 answer) |
| Ransomware | **BLACKFROST** | detonates on countdown |
| Terminal | **NIMBUS Secure Terminal (NST)** | the web app |
| Alex's AI override word | **AURORA** | fixes the tampered bot (P8) |
| Kill-switch passphrase | **NORTHSTAR** | revealed by fixed bot (P8) |
| Exfil cloud bucket | **frost-vault-882** | fragment "882" (P7) |

---

## 2. MASTER ANSWER KEY (the unskippable chain)

| # | Puzzle | Player enters / finds | Exact answer | Unlocks |
|---|---|---|---|---|
| 1 | The Tailgate | Lockbox 4-digit | **2071** | Desk key |
| 2 | The Sticky Trap | NST username | **a.mercer** | — |
| 2 | The Sticky Trap | NST passphrase | **rocket cactus car lightning bolt** | MFA prompt |
| — | *(decoy expired pw)* | *(sticky note)* | *Summer2023!* → "expired" | teaches failure |
| 3 | Second Factor | MFA 6-digit | **481509** | Desktop |
| 4 | The Bait | Identify phish + "Report" | email from **it-support@nimbus-cloudsupport.com** | folder code |
| 4 | The Bait | Hidden folder code | **7793** (folder `BF_7793`) | USB pointer |
| 4 | The Bait | *(learns override word)* | **AURORA** (in Alex's email) | needed at P8 |
| 5 | The Drop | Plug in USB, read loader | initials **MW** + "see Wi-Fi survey" | network puzzle |
| 6 | Ghost Signal | Spot rogue SSID | **NIMBUS_5ecure** | location |
| 6 | Ghost Signal | Rogue AP location | **Contractor Bench / Desk 14** | narrows suspect |
| 7 | The Trusted One | Accuse correct insider (exact ID) | **EXT-4471** (Marcus Webb) | clears Riley + 2 decoys, opens P8 |
| 7 | The Trusted One | Cloud bucket number | **882** | kill fragment |
| 8 | The Confidant | Give bot override word | **AURORA** | bot reveals NORTHSTAR + console |
| 8 | The Confidant | Kill passphrase revealed | **NORTHSTAR** | console access |
| 🏁 | Kill BLACKFROST | IR action checklist | Isolate · Preserve evidence · Report | arms console |
| 🏁 | Kill BLACKFROST | 3 fragments | ID **4471** · Bucket **882** · Pass **NORTHSTAR** | **WIN** |

**Final kill-switch fields:** `4471 / 882 / NORTHSTAR`.

---

## 3. Why nothing can be skipped (quick proof)

- You can't reach the PC without the **desk key** (P1).
- You can't pass the login without the **passphrase** from desk objects (P2).
- The passphrase alone fails — you need the **token** for MFA (P3).
- The hidden folder (P4) names the **USB**; the USB (P5) sends you to the **Wi-Fi survey**; the survey (P6) gives the **location**; the location + initials + badge logs identify the **insider** (P7).
- The console is hidden behind the **tampered AI**, which only yields **NORTHSTAR** after **AURORA** (P8).
- The finale needs **all three fragments** (4471 / 882 / NORTHSTAR) at once.

---

## 4. Master props & materials list (all puzzles)

### Physical props
| Item | Used in | Qty |
|---|---|---|
| Lockbox with 4-digit combination | P1 | 1 |
| Keyed desk drawer/cabinet + key (key lives in lockbox) | P1→P3 | 1 |
| Visitor sign-in log (printed binder page) | P1 | 1 |
| "Visitor Policy" poster | P1 | 1 |
| Decoy yellow sticky note ("pw: Summer2023!") | P2 | 1 |
| "Passphrase Policy" poster | P2 | 1 |
| 4 desk objects with colored dots: **rocket(red), cactus(green), car(blue), lightning bolt(yellow)** | P2 | 4 |
| Desk nameplate "A. MERCER" | P2 | 1 |
| "NIMBUS Authenticator" token card showing **481509** (in drawer) | P3 | 1 |
| Sealed envelope "MFA RECOVERY CODES — break glass" (backup = 481509) | P3 | 1 |
| USB stick labeled **PROJECT FROST** (taped under evidence shelf) | P5 | 1 |
| "Parking lot" photo print (USB-drop origin, has EXIF when digital) | P5 | 1 |
| Network-diagram poster | P6 | 1 |
| Wi-Fi site-survey printout | P6 | 1 |
| Data-classification legend poster (Public/Internal/Confidential) | P7 | 1 |
| Three folders labeled Public(green)/Internal(amber)/**Confidential(red)** | P7 | 3 |
| Cloud-exfil printout, host-gated until correct accusation (names EXT-4471, bucket 882) | P7 | 1 |
| Badge Access Log (5 suspects, no row highlighted; printed binder copy + digital CSV) | P7 | 1 |
| Contractor/HR binder (desk map, badge IDs, statuses — incl. Priya Nair + Tom Baxter decoys) | P7 | 1 |
| HR "TERMINATED" notice for Riley + angry sticky note (red herring) | P7 | 1 |
| UV torch + UV-ink marking (optional cross-zone clue) | C↔D | 1 |
| Lanyards / blank badges (set dressing) | A | few |

### Digital (web app pages — built in Phase 3)
`login.html` · `mfa.html` · `desktop.html` · `mail.html` · `files.html` · `network.html` · `assistant.html` · `killswitch.html` · `win.html` · `fail.html`

### Real host files
`C:\NIMBUS\Live\Evidence\badge_access.csv` · `C:\NIMBUS\Live\Evidence\parking_lot_metadata.txt` ·
`C:\NIMBUS\Live\NIMBUS_USB\loader.txt` + `exfil_list.csv` · optional custom `parking_lot.jpg` · branded wallpaper.

---

## 5. Timing model (45-min target)

| Segment | Puzzles | Raw min | With parallel middle |
|---|---|---|---|
| Break-in | 1·2·3 | 16 | 14 |
| Investigation | 4·5·6 | 18 | 14 (sub-teams) |
| Reveal | 7·8 | 13 | 13 |
| Finale | 🏁 | 4 | 4 |
| **Total** | | **51** | **~45** |

P4/P5/P6 can be partly worked in parallel by sub-teams, then converge at the P7 bottleneck.

---

## 6. Hint philosophy (full ladder in Phase 5)

Every puzzle has **3 escalating hints**: (1) nudge toward the right *place/clue*, (2) reveal the
*method*, (3) all-but-give the *answer*. Hints are written in-world ("Alex's voice") so they don't
break immersion. The host delivers them on request or when a team stalls ~3+ minutes.

---

## 7. Reset summary (full checklist in Phase 5)

Digital: host reset hotkey → web app to `login.html`, storage cleared. Files: `reset.bat` restores
`\Evidence` + `\NIMBUS_USB`. Physical: relock lockbox to a non-answer, re-tape USB, reseal MFA
envelope, reset folders, re-stack binders. Target ≤ 10 min between groups.
