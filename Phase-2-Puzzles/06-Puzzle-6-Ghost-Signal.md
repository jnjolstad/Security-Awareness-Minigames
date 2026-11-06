# Puzzle 6 — "Ghost Signal"

| | |
|---|---|
| **Mode** | Physical → Computer |
| **Position in chain** | After P5 ("see Wi-Fi survey") → unlocks Puzzle 7 (insider ID) |
| **Output** | Rogue AP location **Contractor Bench / Desk 14** |

---

### 1. Puzzle Name
**Ghost Signal** — *"There's a network here that shouldn't exist."*

### 2. Story Purpose
The USB notes pointed to a fake Wi-Fi network the attacker used to harvest credentials. On the SOC
wall, players compare the **network diagram** and **Wi-Fi survey** to spot the **evil-twin** access
point — and read where it's broadcasting from, narrowing the suspect to the contractor bench.

### 3. Security Topic
**Network Security** · **Rogue Wi-Fi** (evil-twin / look-alike SSIDs).

### 4. Learning Objective
Players learn that attackers stand up Wi-Fi networks that **mimic the real SSID** with a tiny change
to trick people into connecting and leaking credentials. The skill is to **scrutinize network names**
and treat unknown/strong/new APs as suspicious.

### 5. Setup Instructions
1. Mount the **Network-Diagram poster** and the **Wi-Fi Site-Survey printout** on the SOC wall (Zone C).
2. Optionally provide `network.html` as a digital companion that asks players to enter the rogue SSID,
   then reveals the location (gating to Puzzle 7).
3. Make the only "approved" SSIDs obvious on the poster (`NIMBUS_Secure`, `NIMBUS_Guest`).

### 6. Materials Needed
- 1 × **Network-Diagram poster** (artifact C3)
- 1 × **Wi-Fi Site-Survey printout** (artifact C4)
- Optional `network.html` companion (Phase 3)

### 7. Exact Puzzle Layout

**Artifact C3 — Network-Diagram poster (legend box):**
> **APPROVED NIMBUS NETWORKS:** `NIMBUS_Secure` (staff) · `NIMBUS_Guest` (visitors).
> ⚠️ *Anything else is rogue. An **evil twin** copies the name with a tiny change.*

**Artifact C4 — Wi-Fi Site-Survey:**

| SSID | Signal | Channel | First seen | Location |
|---|---|---|---|---|
| NIMBUS_Secure | −42 | 36 | baseline | Server Room |
| NIMBUS_Guest | −55 | 6 | baseline | Reception |
| **NIMBUS_5ecure** | **−38 (strong)** | 11 | **09:14 (NEW)** | **Contractor Bench — Desk 14** |
| printer_direct | −70 | 1 | baseline | Print Room |
| NIMBUS_Secure | −60 | 36 | baseline | Floor 2 |

The rogue: **`NIMBUS_5ecure`** — the "S" replaced with "5". It's **new**, unusually **strong**, on an
odd channel, and broadcasting from **Desk 14 (Contractor Bench)**.

### 8. How Players Discover It
Puzzle 5's `loader.txt` explicitly says "clone of corporate Wi-Fi — see the Wi-Fi survey on the SOC
wall," directing players to artifacts C3/C4.

### 9. How Players Solve It
Players compare each SSID in the survey against the two approved names. Four entries match approved
networks (or are normal infrastructure); one — **`NIMBUS_5ecure`** — is a look-alike with a swapped
character, freshly appeared and strong. They read its **Location** column: **Contractor Bench / Desk
14**. (If using `network.html`, entering `NIMBUS_5ecure` reveals the location and gates to P7.)

### 10. Solution
Rogue SSID **`NIMBUS_5ecure`** → location **Contractor Bench / Desk 14**. Players now know the insider
works at the contractor bench (combine with **MW** from P5).

### 11. Hint 1 (nudge)
*"Only two NIMBUS networks are approved (see the poster). On the survey, one SSID is pretending to be
one of them. Read the names **character by character**."*

### 12. Hint 2 (method)
*"An evil twin changes one character. Which 'NIMBUS_Secure' isn't spelled with an **S**? Once you spot
it, check its **Location** column."*

### 13. Hint 3 (all but answer)
*"It's **NIMBUS_5ecure** (a '5' instead of 'S') — new and strong, broadcasting from **Desk 14, the
Contractor Bench**. That's where your suspect sits."*

### 14. Reset Instructions
Re-mount/clear the posters (they're static — no consumables). Reset `network.html` state via host
hotkey. (~10 sec.)

### 15. Estimated Solve Time
**~6 minutes.**
