# Puzzle 7 — "The Trusted One"

| | |
|---|---|
| **Mode** | Physical + Computer (cross-reference) |
| **Position in chain** | After P5 (MW) + P6 (Desk 14) → unlocks Puzzle 8 |
| **Output** | Insider **EXT-4471 (Marcus Webb)** + cloud fragment **882**; Riley + 2 decoys cleared |

> **This is the twist puzzle.** Teams will want to blame Riley (the fired sysadmin). The evidence proves
> they can't have done it — and points to the trusted contractor instead.

---

### 1. Puzzle Name
**The Trusted One** — *"It wasn't the angry one. It was the one nobody questioned."*

### 2. Story Purpose
Players now have a suspect profile (initials **MW**, **Desk 14 / Contractor Bench**). By
cross-referencing **badge access logs**, the **contractor/HR binder**, and which **Confidential** data
was stolen, they confirm the insider is **Marcus Webb (EXT-4471)** — and discover his exfiltration to a
personal **cloud bucket**. The loud, obvious suspect, **Riley Tran**, is cleared by a deactivated badge.

### 3. Security Topic
**Insider Threats** · **Data Classification** · **Cloud Security**.

### 4. Learning Objective
Players learn that (a) insiders are often **trusted third parties** (contractors/vendors) with
unreviewed access; (b) you must **follow evidence, not assumptions** (clear the innocent); (c)
attackers target **Confidential** data and exfiltrate it to **personal cloud storage** — which is why
classification and access logging matter.

### 5. Setup Instructions
1. Provide the **Badge Access Log** both as a printed binder page and as `badge_access.csv` viewable in
   `files.html`.
2. Place the **Contractor/HR binder** (desk map + badge IDs + statuses) on the evidence shelf.
3. Plant the **red-herring** items: an HR "TERMINATED" notice for Riley + an angry sticky note ("They'll
   regret this. —R").
4. Set up the three **classification folders** (Public/Internal/**Confidential-red**) as context props.
   Keep the physical **cloud-exfil printout** at the host station until the accusation is confirmed.
5. In `files.html`, the **"Suspect Board / Accuse"** field accepts a contractor/employee ID:
   only the **exact full ID EXT-4471** advances to P8; any other suspect ID returns alibi feedback.
   Webb is **not** highlighted in the badge log / binder — players must cross-reference five suspects.

### 6. Materials Needed
- Printed **Badge Access Log** (artifact D2) + `badge_access.csv` (Phase 3)
- **Contractor/HR binder** (artifact D3)
- **Data-Classification legend poster** (artifact D4)
- 3 × folders Public/Internal/**Confidential(red)**
- **Cloud-exfil printout** (artifact D5), host-gated until a correct accusation
- Red-herring **HR notice + angry note** (artifact D6)
- `files.html` "Accuse" gate (Phase 3)

### 7. Exact Puzzle Layout

**Artifact D2 — Access Control Audit:**

| When | Name | Badge ID | Area / action | Result |
|---|---|---|---|---|
| 08:58 | Dana Cole | EMP-3310 | Helpdesk | OK |
| 09:11 | **Marcus Webb** | **EXT-4471** | SOC (secure) | OK |
| 09:40 | Priya Nair | EMP-4185 | Server Room | OK |
| 12:40 | Dana Cole | EMP-3310 | Helpdesk | OK |
| 18:05 | Tom Baxter | EXT-5012 | Loading Bay | OK |
| 02:30 | **Marcus Webb** | **EXT-4471** | Server Room | OK (after-hours) |
| 14 days prior | Riley Tran | EMP-2087 | Access Administration | **BADGE DEACTIVATED — termination** |

The audit also lists two independently detected incident events: the rogue AP appeared at the SOC
contractor bench at **09:14**, and a bulk transfer from the Server Room segment began at **02:30**.
Only **EXT-4471 (Marcus Webb)** has access correlated with both. Riley's badge was deactivated before
the incident; Priya appears only at 09:40; Tom only opened the Loading Bay.

**Artifact D3 — Contractor/HR binder (excerpt):**
> *Desk map:* Desk 14 = **Contractor Bench → Marcus Webb (NimbusIT, EXT-4471)**; Desk 17 = Priya Nair
> (EMP-4185, Network); Desk 03 = Tom Baxter (EXT-5012, Facilities).
> *Status:* Webb = "External contractor, 3 yrs, **access never reviewed**." Tran = "Sysadmin —
> **TERMINATED 14 days ago**, badge revoked." Cole = "Helpdesk, active." Nair = "Network engineer,
> **daytime maintenance window only**." Baxter = "Facilities contractor, **Loading Bay / Facilities
> access only** — no SOC or Server Room."

**Artifact D4 — Data-Classification poster:**
> **DATA CLASSIFICATION** 🟢 PUBLIC (share freely) · 🟠 INTERNAL (staff only) · 🔴 **CONFIDENTIAL**
> (encrypt + **log every access**). *Attackers go straight for 🔴.*

**Artifact D5 — Cloud-exfil printout (released only after a correct accusation):**
> *"ALERT (auto-generated): bulk copy of 🔴 CONFIDENTIAL ClientVault files → external cloud bucket
> **`frost-vault-882`**. Bucket owner token: **EXT-4471**. 47 files, 3.2 GB. Off-network destination."*

**Artifact D6 — red herring:** HR notice "Riley Tran — TERMINATED, escorted out" + sticky note *"They'll
regret this. —R."*

### 8. How Players Discover It
Carrying **MW** (P5) and **Desk 14 / Contractor Bench** (P6), players turn to the evidence shelf's
binders and the classification folders. The `files.html` desktop also surfaces the badge CSV and the
"Accuse" board.

### 9. How Players Solve It
1. **Match the profile:** initials **MW** + Desk 14 contractor bench → the contractor binder names
   **Marcus Webb (EXT-4471)**.
2. **Check the audit:** Webb's access correlates with both incident events. Riley's badge was already
   deactivated; Priya appears only after the first event; Tom never entered a relevant secure area.
3. **Accuse:** enter **EXT-4471** in the `files.html` Suspect Board → "Identity confirmed."
4. **Read the revealed DLP alert:** the in-app alert (and optional host-released printout) confirms the
   bucket **`frost-vault-882`**. Note the cloud number **882**.

### 10. Solution
Insider = **Marcus Webb, EXT-4471** (cloud bucket **frost-vault-882** → fragment **882**). Riley Tran and
the two decoys are innocent. Accusing the exact ID **EXT-4471** unlocks Puzzle 8. Wrong accusations return:
- Riley (EMP-2087): *"Alibi confirmed — badge deactivated 14 days ago. Re-examine."*
- Dana (EMP-3310): *"Dana was phished, not the attacker. Keep looking."*
- Priya (EMP-4185): *"Daytime maintenance only (09:40); absent for the 02:30 after-hours breach. Re-examine."*
- Tom (EXT-5012): *"Badge only opens Facilities / Loading Bay — never the SOC or Server Room. Re-examine."*

### 11. Hint 1 (nudge)
*"You know the attacker's initials (**MW**) and that they sit at the **Contractor Bench, Desk 14**. Who
does the contractor binder put there?"*

### 12. Hint 2 (method)
*"Don't trust the obvious angry ex-employee — **check the badge log**. Who actually badged into the
secure areas at the attack times? And whose badge was already **switched off**?"*

### 13. Hint 3 (all but answer)
*"Riley's badge was deactivated 14 days ago — they couldn't get in. Only **Marcus Webb (EXT-4471)** was
correlated with both incident times. Accuse **EXT-4471**, and open the on-screen 🔴 Confidential folder for the cloud bucket
number **882**."*

### 14. Reset Instructions
Return D2/D3/D6 to the binders; return the cloud-exfil printout to the host station; reset the
`files.html` "Accuse" state via host hotkey. (~2 min.)

### 15. Estimated Solve Time
**~8 minutes** (the hardest puzzle; multi-source cross-reference).
