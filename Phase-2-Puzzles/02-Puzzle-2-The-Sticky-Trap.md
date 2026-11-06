# Puzzle 2 — "The Sticky Trap"

| | |
|---|---|
| **Mode** | Physical → Computer |
| **Position in chain** | After P1 (desk key) → unlocks Puzzle 3 (MFA) |
| **Output** | NST **username + passphrase** accepted |

---

### 1. Puzzle Name
**The Sticky Trap** — *"The password on the sticky note is a lie."*

### 2. Story Purpose
With the desk key, players reach Alex's PC — but it's locked at the **NIMBUS Secure Terminal** login.
A yellow sticky note offers a password... that fails. Alex used a proper **passphrase** instead, hidden
in plain sight on her desk. Players learn to build and recognize strong credentials in order to log in.

### 3. Security Topic
**Password Security** (passphrases vs. weak/written passwords, rotation/expiry).

### 4. Learning Objective
Players learn that short, reused, written-down passwords (the sticky note) are weak and often
expired/compromised, while a **passphrase of several random words** is strong and memorable. The
*method of building the passphrase is the solution*, so the lesson is unavoidable.

### 5. Setup Instructions
1. The PC boots to `login.html` showing user `a.mercer` and a passphrase field.
2. Stick the **decoy yellow note** ("pw: Summer2023!") on the monitor bezel.
3. Mount the **Passphrase Policy poster** by the desk.
4. Place the **four dotted desk objects** around the desk: rocket (🔴 red dot), cactus (🟢 green),
   car (🔵 blue), lightning bolt (🟡 yellow).
5. Put the **"A. MERCER" nameplate** on the desk (reinforces the username).

### 6. Materials Needed
- PC at `login.html` (Phase 3)
- 1 × yellow sticky note: `pw: Summer2023!`
- 1 × **Passphrase Policy poster** (artifact B1)
- 4 × desk objects with colored number dots (rocket/cactus/car/lightning bolt)
- 1 × desk nameplate "A. MERCER"

### 7. Exact Puzzle Layout

**Login screen (`login.html`):**
- Username field (pre-filled or hinted): `a.mercer`
- Passphrase field + "Sign in" button.
- If `Summer2023!` is entered → red banner: *"PASSWORD EXPIRED 90 days ago. Use your new passphrase."*
- If correct passphrase entered → proceeds to MFA (Puzzle 3).

**Artifact B1 — Passphrase Policy poster:**
> **NIMBUS PASSWORD POLICY**
> ❌ Weak: `Summer2023!` (short, predictable, expires)
> ✅ Strong: **four unrelated object labels** you can *see* but others can't guess.
> 🔑 Build yours in **dot order: 🔴 → 🟢 → 🔵 → 🟡**

**The four dotted objects (each is one word):**

| Dot | Object | Word |
|---|---|---|
| 🔴 Red (1) | toy rocket | `rocket` |
| 🟢 Green (2) | small cactus | `cactus` |
| 🔵 Blue (3) | toy car | `car` |
| 🟡 Yellow (4) | lightning bolt | `lightning bolt` |

**Passphrase:** `rocket cactus car lightning bolt` (login accepts any case, spaces optional).

### 8. How Players Discover It
The PC is the room's obvious focal point. The sticky note begs to be tried first (and fails on
purpose), pushing players to the poster, which tells them to assemble four words from the desk in dot
order.

### 9. How Players Solve It
Players try the sticky note (fails → "expired"), read the policy poster, find the four colored-dot
objects, and enter the words in dot order as the passphrase. Username is `a.mercer` (nameplate / login
hint).

### 10. Solution
Username **a.mercer**, passphrase **rocket cactus car lightning bolt** → login accepted → MFA prompt
appears (Puzzle 3).

### 11. Hint 1 (nudge)
*"The yellow note is bait — Alex literally warned you it lies. The real rule is on the policy poster.
Read what 'strong' looks like."*

### 12. Hint 2 (method)
*"Four object labels. Look for small **colored dots** on objects around the desk — they tell you which
words, and in what order (red, green, blue, yellow)."*

### 13. Hint 3 (all but answer)
*"Rocket (red), cactus (green), car (blue), lightning bolt (yellow). Type them in that order. Username is
**a.mercer**."*

### 14. Reset Instructions
Re-stick the yellow note, return the four objects to their spots, and reload `login.html` (cleared by
the host reset hotkey). (~30 sec.)

### 15. Estimated Solve Time
**~6 minutes.**
