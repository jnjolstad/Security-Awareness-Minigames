# Puzzle 3 — "Second Factor"

| | |
|---|---|
| **Mode** | Physical → Computer |
| **Position in chain** | After P2 (passphrase) → unlocks the Desktop (Puzzle 4) |
| **Output** | **6-digit MFA code** → desktop unlocks |

---

### 1. Puzzle Name
**Second Factor** — *"A password is only half the lock."*

### 2. Story Purpose
The passphrase gets players to a second wall: NIMBUS requires **Multi-Factor Authentication**. Alex's
account is protected by a token — the "something you have." Players find the **authenticator prop** in
the now-unlocked desk drawer and enter its code, proving why MFA stops an attacker who only has a
password.

### 3. Security Topic
**Multi-Factor Authentication** (something you *know* + something you *have*).

### 4. Learning Objective
Players experience first-hand that a stolen/guessed password isn't enough when MFA is on — you also
need a physical second factor. They learn what an authenticator token is and why MFA blocks most
account takeovers.

### 5. Setup Instructions
1. After a correct passphrase, `login.html` advances to `mfa.html` requesting a **6-digit code**.
2. Inside the **desk drawer** (opened with P1's key), place the **NIMBUS Authenticator token card**
   showing **481509**, plus the clue cards used later.
3. Place the sealed **"MFA RECOVERY CODES — break glass"** envelope in the drawer as a backup (also
   contains 481509). This is the anti-frustration valve.

### 6. Materials Needed
- `mfa.html` page (Phase 3)
- 1 × **Authenticator token card** (artifact B2) displaying `481509`
- 1 × sealed **MFA recovery envelope** (backup code 481509)
- The desk drawer (already opened via P1 key)

### 7. Exact Puzzle Layout

**MFA screen (`mfa.html`):**
> 🔒 **Multi-Factor Authentication required**
> *"Your password was accepted. Enter the 6-digit code from your NIMBUS Authenticator."*
> [ _ _ _ _ _ _ ]  → "Verify"
> Wrong code → *"Incorrect or expired code. Check your token."* Correct → desktop loads.

**Artifact B2 — Authenticator token card (in drawer):**
> ```
> ┌─────────────────────────────┐
> │   NIMBUS AUTHENTICATOR  🔐   │
> │   a.mercer                  │
> │        > 4 8 1 5 0 9 <      │
> │   ▮▮▮▮▮▮▮▯▯▯  refreshing…    │
> └─────────────────────────────┘
> ```

**Artifact B3 — sealed envelope:** "MFA RECOVERY CODES — break glass only." Inside: *"Backup code:
481509."*

### 8. How Players Discover It
Immediately after the passphrase succeeds, the screen demands a 6-digit code — an obvious new gate.
The desk drawer (opened in P1) is the natural place to look, where the token card sits.

### 9. How Players Solve It
Players realize the password alone isn't enough, find the **authenticator token** in the drawer, and
type its 6-digit code into the MFA prompt. (If they can't find it, the host points them to the sealed
recovery envelope.)

### 10. Solution
Enter **481509** → MFA passes → Alex's **desktop** (`desktop.html`) loads, beginning the investigation
phase. A desktop "README" shows **Alex's Note #2**:
> *"Password + token protected my account. They couldn't stop him abusing his own trusted access.
> Start with my email. — A."*

### 11. Hint 1 (nudge)
*"Your password worked, but NIMBUS wants a **second factor** — something you physically have. Where would
Alex keep a token? You just unlocked her drawer."*

### 12. Hint 2 (method)
*"Look in the desk drawer for a card labeled **NIMBUS Authenticator**. It shows a rotating 6-digit code —
that's your second factor."*

### 13. Hint 3 (all but answer)
*"The token card reads **481509**. Type those six digits into the MFA box. (Backup: the sealed 'MFA
Recovery Codes' envelope holds the same code.)"*

### 14. Reset Instructions
Return the token card to the drawer; if the recovery envelope was opened, swap in a fresh sealed copy
(keep spares). Host reset hotkey returns the app to `login.html`. (~30 sec; +1 min if re-sealing.)

### 15. Estimated Solve Time
**~4 minutes.**
