# 02 — Room Layout

> A single room divided into **five themed zones**. Players naturally sweep left-to-right, but the
> puzzle chain (not the geography) controls the order — zones "open up" as locks are solved.

---

## Floor plan (ASCII map)

Assumes a room roughly **3.5 m × 4.5 m**. Scales up or down; the only hard requirement is that the
PC (Zone B) is centrally visible and reachable by the whole team.

```
        ENTRY DOOR
            │
   ┌────────▼─────────────────────────────────────────────────────────────┐
   │                                                                        │
   │  ╔══════════════╗                                   ╔════════════════╗ │
   │  ║  ZONE A       ║                                   ║   ZONE C        ║ │
   │  ║  RECEPTION    ║                                   ║   SOC WALL      ║ │
   │  ║               ║         ╔═══════════════╗         ║                 ║ │
   │  ║ • Visitor log ║         ║   ZONE B       ║         ║ • Network map   ║ │
   │  ║ • Badge poster║         ║   ALEX'S DESK  ║         ║   poster        ║ │
   │  ║ • Lockbox 🔒  ║         ║                ║         ║ • Wi-Fi survey  ║ │
   │  ║ • Sign-in pen ║         ║  🖥  THE PC     ║         ║ • Incident board║ │
   │  ╚══════════════╝         ║  ⌨  keyboard    ║         ║ • UV clue       ║ │
   │                           ║  🗄 drawers 🔒   ║         ╚════════════════╝ │
   │                           ║  📝 sticky notes║                            │
   │                           ║  🔑 token prop  ║         ╔════════════════╗ │
   │                           ╚═══════════════╝         ║   ZONE D        ║ │
   │                                                      ║   EVIDENCE SHELF║ │
   │   ZONE E (the FINALE) lives ON the PC in Zone B —    ║                 ║ │
   │   the BLACKFROST countdown + kill-switch console.    ║ • Binders       ║ │
   │   A wall countdown (optional) is visible room-wide.  ║ • Sealed envel. ║ │
   │                                                      ║ • USB (taped)   ║ │
   │   ⏱  WALL COUNTDOWN (projector/second screen)        ║ • "Confidential"║ │
   │                                                      ║   folders 🔒    ║ │
   │                                                      ╚════════════════╝ │
   └────────────────────────────────────────────────────────────────────────┘
```

Legend: 🔒 lock · 🖥 PC monitor · ⌨ keyboard · 🗄 lockable drawer · 📝 paper clue · 🔑 prop · ⏱ countdown.

---

## Zone-by-zone breakdown

### ZONE A — Reception / Welcome Desk  *(Physical security · Tailgating · Visitor management)*
The "front door" of the experience. A small table dressed as a reception desk.

| Item | Purpose |
|---|---|
| **Visitor sign-in log** (binder) | Holds the tailgating/visitor-management puzzle data (Puzzle 1) |
| **"Security starts at the door" poster** | Decoration + hides the lock-combination logic |
| **Lockbox** (4-digit combo) | Contains the **key to Alex's desk cabinet** + Alex's first note |
| **Reception phone / "Authorized Visitors" list** | Supports cross-referencing of who was really allowed in |
| **Pen on a chain, lanyards, blank badges** | Set dressing + a spare-badge prop used later |

*Opens:* the path to Zone B (the desk key).

---

### ZONE B — Alex's Workstation  *(Password security · MFA · Device security)*
The heart of the room. Everything funnels through this PC.

| Item | Purpose |
|---|---|
| **The PC + monitor** | Boots straight into the locked **NIMBUS Secure Terminal** login page |
| **Keyboard & mouse** | Player input for all digital puzzles |
| **Lockable desk drawer** | Opened by Zone A's key; holds the **authenticator token prop** + clue cards |
| **Decoy sticky note** ("pw: Summer2023!") | The *wrong* (expired) password — teaches why sticky-note passwords fail |
| **Desk objects** (mug, plant, framed photo, calendar) | Hide the four passphrase words for Puzzle 2 |
| **Coat on chair / personal items** | Immersion: "someone just left" |

*Opens:* the desktop environment (the investigation phase) and ultimately Zone E.

---

### ZONE C — SOC Wall  *(Network security · Rogue Wi-Fi · Incident reporting)*
A wall or board dressed as the SOC's "war wall."

| Item | Purpose |
|---|---|
| **Network diagram poster** | The map where players spot the **rogue access point** (Puzzle 6) |
| **Wi-Fi site-survey printout** | Lists SSIDs; one is a look-alike of the corporate network |
| **Incident response board** | "What to do in a breach" steps — used in the finale's reporting beat |
| **UV-ink hidden marking** | A coordinate/letter visible only under the UV torch from Zone D |
| **Pinned photos / red string** | Detective aesthetic + ties suspects to locations |

*Opens:* the suspect-location clue feeding Puzzle 7 (insider ID).

---

### ZONE D — Evidence Shelf / Filing  *(USB security · Data classification · Cloud security · Insider threats)*
A shelf or filing area of "case evidence."

| Item | Purpose |
|---|---|
| **Binders: Badge Access Logs, HR/Contractors, Policies** | Source data to unmask the insider (Puzzle 7) |
| **Sealed envelopes: "MFA Recovery Codes", "DO NOT OPEN"** | MFA recovery prop + timed/gated reveals |
| **The planted USB stick** (taped under shelf / in a "parking lot" photo) | The USB-drop puzzle artifact (Puzzle 5) |
| **"Confidential / Internal / Public" labeled folders** | Data-classification sorting puzzle; only one folder matters |
| **UV torch** | Reveals the hidden Zone C marking |

*Opens:* the insider's identity + the data fragment for the kill-switch code.

---

### ZONE E — The Kill-Switch Finale  *(Incident reporting + payoff)*
Not a physical corner — it's the **climax screen on the PC** plus an optional room-wide countdown.

| Item | Purpose |
|---|---|
| **BLACKFROST countdown** (PC page + optional wall projection) | The clock; creates urgency from minute one |
| **Kill-switch console page** | Where the final 3-fragment code is entered |
| **Win/lose screens + Alex's final message** | The emotional payoff and debrief springboard |

---

## Sightlines, flow & accessibility

- **Center the PC.** Zone B should be reachable by 3–6 people at once; use a desk, not a cramped nook.
- **Countdown is always visible.** A second monitor or short-throw projector showing the timer keeps
  pressure on without players needing to babysit the PC.
- **Left-to-right intuition.** Place Zone A nearest the entry so the first puzzle is obvious; later
  zones reveal their relevance as locks open.
- **No dead ends or "pixel-hunting."** Every searchable container is either clearly a container
  (lockbox, drawer, envelope) or flagged by a clue. Nothing critical is hidden behind immovable
  furniture or requires standing on objects.
- **Lighting.** Keep general lighting functional; the only "dark" mechanic is the UV clue, which works
  in normal light with the torch. Avoid a fully dark room (safety + accessibility).
- **Seating.** At least one chair at the desk; ensure the experience is solvable seated for players
  who need it.

---

## Physical security inventory (props & locks)

| Lock / container | Type | Opened by | Reveals |
|---|---|---|---|
| Reception **lockbox** | 4-digit combination | Tailgating/visitor-log logic (Puzzle 1) | Desk cabinet key + Alex's note |
| Desk **drawer** | Keyed | Key from lockbox | Authenticator token prop + clue cards |
| **"Confidential" folder clasp** | Small padlock (3-letter) | Data-classification clue (Puzzle 7) | Insider evidence sheet |
| Sealed **"MFA Recovery" envelope** | Tamper seal | Reached at Puzzle 3 | MFA backup path (anti-frustration) |
| **USB** | Taped/hidden | Found via Puzzle 5 trigger | Plugs into PC "evidence viewer" |

*(Exact combinations, codes, and the full 15-point spec for each puzzle are delivered in Phase 2.)*

---

## Setup footprint & reusability

- **Minimum furniture:** 1 reception table, 1 main desk for the PC, 1 wall/board, 1 shelf. All
  standard office furniture — nothing custom built.
- **Reset-friendly placement:** every consumable (sealed envelopes, taped USB, folder contents) is
  listed in the Phase 5 reset checklist so a host can re-arm the room in ~5 minutes.
- **Portable option:** the whole thing can collapse into "PC + a labeled tote of props," making it
  easy to run the room in different meeting rooms across the month.
