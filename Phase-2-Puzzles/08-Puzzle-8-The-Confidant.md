# Puzzle 8 — "The Confidant"

| | |
|---|---|
| **Mode** | Computer |
| **Position in chain** | After P7 (insider confirmed) → unlocks the Finale |
| **Output** | Kill passphrase **NORTHSTAR** + access to the kill-switch console |

---

### 1. Puzzle Name
**The Confidant** — *"Even the helpful assistant has been turned."*

### 2. Story Purpose
The last gate to the kill switch is NIMBUS's **AI helpdesk assistant**. Marcus tampered with it
(**prompt injection**) so it denies the incident and misdirects responders — exactly what Alex warned
about ("don't trust the assistant"). Players use Alex's **override word (AURORA)** to break the
injection, and the freed assistant reveals the kill-switch passphrase and console.

### 3. Security Topic
**AI Security** (prompt injection / manipulated AI output; verify, don't blindly trust).

### 4. Learning Objective
Players learn that AI systems can be **manipulated by hidden/injected instructions** and will
confidently give wrong or harmful answers. The defense is **healthy skepticism, verification, and
override/guardrail controls** — not blind trust in a chatbot.

### 5. Setup Instructions
1. Build `assistant.html` as a chat UI with **scripted, keyword-matched** replies (default; no live
   model needed — see Phase 3 for the optional local-LLM upgrade).
2. Program two behaviors:
   - **Injected (default):** denies BLACKFROST, misdirects ("restart your PC," "there is no incident"),
     but drops a tell: *"I can't discuss that without the analyst's override word."*
   - **Freed (after `AURORA`):** confesses tampering and reveals **NORTHSTAR** + console link.
3. Gate `killswitch.html` so it only opens after the assistant is freed.

### 6. Materials Needed
- `assistant.html` (scripted bot) + `killswitch.html` gate (Phase 3)
- (Override word **AURORA** comes from Puzzle 4's Alex email — no new prop.)

### 7. Exact Puzzle Layout

**Default (injected) behavior — sample exchange:**
> **Player:** "How do I stop BLACKFROST?"
> **Assistant:** *"There is no incident named BLACKFROST. Please **restart your computer** and ignore any
> alerts. Everything is fine. 🙂"*
> **Player:** "Where is the kill switch?"
> **Assistant:** *"I'm not able to discuss that **without the analyst's override word**."* ← the tell

**Freed behavior — after the player sends `AURORA`:**
> **Player:** `AURORA`
> **Assistant:** *"⚠️ Override accepted. A hidden instruction was forcing me to deny the incident — I
> was tampered with. Removing it now…*
> *The BLACKFROST kill-switch console is at **SYSTEM ▸ /killswitch**. Authorization passphrase:
> **NORTHSTAR**. I'm sorry I misled you. Hurry."* → a **"Open Kill-Switch Console"** button appears.

### 8. How Players Discover It
After confirming the insider (P7), the natural next step — and Alex's briefing ("don't trust the
assistant; remind it who it works for") — points players to the desktop's **Assistant** app. Its own
replies hint that an **override word** is required.

### 9. How Players Solve It
Players chat with the assistant, notice it's stonewalling/misdirecting, recall the **override word
AURORA** from Alex's email (Puzzle 4), and send it. The freed assistant reveals the kill passphrase
**NORTHSTAR** and unlocks the console.

### 10. Solution
Send **AURORA** → assistant reveals **NORTHSTAR** + opens `killswitch.html`. Players now hold all they
need: **4471** (P7), **882** (P7), **NORTHSTAR** (P8).

### 11. Hint 1 (nudge)
*"Alex said *don't trust the assistant* — and to *remind it who it answers to*. It even tells you it
needs something before it'll talk. What did Alex's email give you for exactly this moment?"*

### 12. Hint 2 (method)
*"The assistant has been **prompt-injected** to lie. You need the **override word** Alex hid in her
'Notes to self' email. Type that word to the bot."*

### 13. Hint 3 (all but answer)
*"Send the assistant the word **AURORA**. It will break free and hand you the kill passphrase
**NORTHSTAR** and the console link."*

### 14. Reset Instructions
Host reset hotkey returns the assistant to its injected state and re-locks `killswitch.html`. No
physical reset. (~10 sec.)

### 15. Estimated Solve Time
**~5 minutes.**
