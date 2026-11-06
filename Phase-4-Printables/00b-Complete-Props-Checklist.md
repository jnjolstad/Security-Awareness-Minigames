# Complete Props & Setup Checklist — empty-room edition

⚠️ **HOST-ONLY.** This list names the lockbox code and the answer-bearing props. Keep it off player-facing screens and walls.

---

## 1. TECHNOLOGY & AV

| ☐ | Item | Details | Qty |
|---|------|---------|-----|
| | **Windows PC** | Runs NIMBUS Secure Terminal, 100% offline; no internet/server/database needed | 1 |
| | **Monitor + keyboard + mouse** | Standard setup | 1 set |
| | **Real USB stick** | Copy `loader.txt` + `exfil_list.csv` (optional: add your own `parking_lot.jpg`) | 1 |
| | **Second screen/projector** | For room-wide BLACKFROST countdown — *optional but recommended* | 0–1 |

## 2. FURNITURE & SURFACES
**Minimum: 4 pieces — all standard office furniture**

| ☐ | Item | Zone | Notes | Qty |
|---|------|------|-------|-----|
| | **Reception table** | A | | 1 |
| | **Main desk** | B | Must have lockable drawer; PC sits here | 1 |
| | **Chair(s)** | B | Keep room solvable while seated | 1–6 |
| | **Wall space or board** | C | For SOC wall display | 1 |
| | **Shelf or filing area** | D | For evidence display | 1 |
| | **Corkboard** | — | For suspect board — *can reuse SOC board if needed* | 0–1 |

## 3. LOCKS, CONTAINERS & SEALS

| ☐ | Item | Details | Qty |
|---|------|---------|-----|
| | **Lockbox, 4-digit combo** | Set to **2071** — holds desk key + Alex Note #1 | 1 |
| | **Key for desk drawer** | Lives inside the lockbox | 1 |
| | **3 colored folders** | Label as **Green / Amber / Red** (Public / Internal / Confidential) | 3 |
| | **Sealable envelopes** | "MFA RECOVERY — break glass" prop; reseal between groups | 3–5 |
| | **Small padlock** | For red folder — *optional; P7 resolves on-screen* | 0–1 |

## 4. PRINTABLES — ≈20 sheets

**Print on:** Cardstock for items that get handled (badges, token, nameplate, labels). Plain A4 for everything else.
Colour makes posters pop, but all puzzles solve in black & white.

| ☐ | Print (file) | Placement | Priority |
|---|---|---|---|
| | **Visitor Policy poster** + **Visitor Sign-In Log** | Reception wall + clipboard | ⭐⭐⭐ |
| | **Passphrase Policy poster** | Workstation wall | ⭐⭐⭐ |
| | **Desk props** (sticky, 4 dot-labels, nameplate, USB label) | Desk / monitor / USB | ⭐⭐⭐ |
| | **Authenticator token** + **MFA recovery envelope** | Desk drawer | ⭐⭐⭐ |
| | **Alex's Notes #1 & #2** | #1 in lockbox, #2 in drawer | ⭐⭐⭐ |
| | **Spot-the-Phish poster** | Wall by the PC | ⭐⭐⭐ |
| | **Network Map poster** + **Wi-Fi Site-Survey** | SOC wall | ⭐⭐ |
| | **Badge Access Log** + **Contractor/HR register** | Evidence binder | ⭐⭐ |
| | **Data-Classification poster** + **folder labels** (Green/Amber/Red) | Above the 3 folders | ⭐⭐ |
| | **Cloud-Exfil alert** | **Host station; release only after correct accusation** | ⭐⭐ |
| | **Riley termination notice** + **angry sticky** | Evidence shelf / board | ⭐ |
| | **Suspect ID badges** (Webb, Tran, Cole, Nair, Baxter, Mercer) | Suspect board | ⭐ |
| | **Parking-lot photo** | SOC wall — *optional atmosphere* | ⭐ |
| | **Door sign + awareness posters** | Entrance + walls | ⭐ |

## 5. PHYSICAL OBJECTS TO SOURCE
**Non-printable items** — use these to carry dot-word labels and create immersion:

| ☐ | Item | Purpose | Qty |
|---|------|---------|-----|
| | **4 desk objects** | Carry the 4 dot-word labels — ideally red rocket, green cactus, blue car, yellow lightning bolt | 4 |
| | **Clipboard** | Hold the visitor log | 1 |
| | **Pen on a chain** | Set dressing at reception | 1 |
| | **Lanyards + badge holders** | For suspect cards + set dressing | ~6 |
| | **2 ring binders** | Evidence binder + policies binder | 2 |
| | **Immersion dressing** | Coat, mug, plant, photo, calendar ("someone just left") | — |
| | **UV torch + UV pen** | Optional cross-zone clue | 0–1 |
| | **Push-pins + red string** | Optional detective board aesthetic | 0–1 |

## 6. CONSUMABLES & STATIONERY

| ☐ | Item | Notes | Qty |
|---|------|-------|-----|
| | **Cardstock** | Print badges, token, nameplate, folder labels | ~6 sheets |
| | **Plain A4 paper** | Print posters and other documents | ~20 sheets |
| | **Real yellow sticky notes** | Decoy password + Riley note feel authentic | a few |
| | **Tape** | Secure USB under shelf, mount posters | 1 roll |
| | **Blu-Tack / glue** | Mount posters and notes | 1 |
| | **Scissors** | Cut multi-item sheets (badges, props, labels) | 1 pair |
| | **Spare sealed envelopes** | MFA recovery — reseal between groups | 3–5 |

## 7. OPTIONAL / ATMOSPHERE

| ☐ | Item | Notes |
|---|------|-------|
| | **Room-wide countdown** | Via projector or second monitor |
| | **Red string + pins** | Suspect web on the detective board |
| | **Parking-lot photo print** | Atmosphere for USB-drop origin |
| | **Door sign + awareness posters** | File 19 — room theming |
| | **General lighting** | Avoid fully dark room (safety + accessibility) |

---

## ⚠️ ANSWER-BEARING PROPS — Place Carefully

**Only these carry codes or key logic. Everything else is atmosphere:**

| Prop | Answer | Unlocks |
|------|--------|---------|
| **Visitor Log** | Only **J. Price / V-2071** breaks all 3 rules | Lockbox code **2071** |
| **4 desk dot-labels** | Order: red → green → blue → yellow | Password **rocket cactus car lightning bolt** |
| **Authenticator token** | MFA code **481509** | Desktop access |
| **Wi-Fi Survey** | Rogue SSID **NIMBUS_5ecure** at **Desk 14** | Network access |
| **Access Audit** | **EXT-4471 (Webb)** correlates with both incident times | Identifies the insider |
| **Cloud-Exfil alert** | Bucket **frost-vault-882** | Fragment **882** |

**Note:** `AURORA` and `NORTHSTAR` are on-screen only — no printables.
