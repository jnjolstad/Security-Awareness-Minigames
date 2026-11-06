# Puzzle 4 — "The Bait"

| | |
|---|---|
| **Mode** | Computer |
| **Position in chain** | After P3 (desktop) → unlocks Puzzle 5 (USB) |
| **Output** | Hidden-folder code **7793** + learns override word **AURORA** |

---

### 1. Puzzle Name
**The Bait** — *"One of these emails opened the door."*

### 2. Story Purpose
Now inside Alex's desktop, players open her **mail** to find how the breach began. Among normal emails
sits the **phishing message** that tricked helpdesk tech Dana Cole into giving up credentials.
Identifying and **reporting** it reveals a hidden folder the malware created — the next breadcrumb.
Alex's own email also hides the AI **override word** they'll need later.

### 3. Security Topic
**Phishing** · Social Engineering (with a built-in **report-it** action).

### 4. Learning Objective
Players learn the tell-tale signs of phishing — **mismatched sender domain, urgency/threats,
mismatched links, generic greeting** — and that the right response is to **report**, not click. Applying
the checklist *is* how they solve the puzzle.

### 5. Setup Instructions
1. Build `mail.html` with the inbox below (one phish among five legit emails).
2. Mount the **"Spot the Phish" checklist poster** near the PC (artifact C1).
3. Wire the **"Report Phishing"** button: reporting the correct email reveals folder code `7793`;
   reporting a legit email returns gentle corrective feedback.
4. Place Alex's self-email containing the override word **AURORA** in the inbox.

### 6. Materials Needed
- `mail.html` + `files.html` (Phase 3)
- 1 × **"Spot the Phish" poster** (artifact C1)
- Email contents (artifact C2, below) for Phase 4 printables/screen text

### 7. Exact Puzzle Layout

**Artifact C1 — "Spot the Phish" poster:**
> **SPOT THE PHISH 🎣** ① Sender domain looks *almost* right? ② Urgent threat/deadline?
> ③ Link doesn't match the real site? ④ Generic "Dear User"? → **Don't click. Report it.**

**Artifact C2 — Inbox (`mail.html`):**

| # | From | Subject | Verdict |
|---|---|---|---|
| 1 | facilities@**nimbuscloud.com** | "This week's lunch menu" | legit |
| 2 | payroll@**nimbuscloud.com** | "Your payslip is available" | legit |
| 3 | **it-support@nimbus-cloudsupport.com** | "⚠ ACTION REQUIRED: password expires in 24h — verify now" | **PHISH** |
| 4 | a.mercer@**nimbuscloud.com** (self) | "Notes to self" | legit (hides AURORA) |
| 5 | ceo@**nimbuscloud.com** | "Town hall Friday 3pm" | legit |
| 6 | backup-service@**nimbuscloud.com** | "Nightly backup complete" | legit |

_All five legitimate emails come from `@nimbuscloud.com`, greet Dana by name and contain no links - so email #3 is the only one that breaks every rule on the poster._

**Email #3 (the phish) body:**
> *From: it-support@nimbus-cloudsupport.com*
> *"Dear User, our records show your password **expires in 24 hours**. To avoid losing access, **verify
> immediately** at http://nimbus-verify.account-secure.ru/?id=**7793**. Failure to act will lock your
> account. — IT Support"*
> 🚩 Wrong domain (`nimbus-cloudsupport.com` ≠ `nimbuscloud.com`), urgency, foreign look-alike link,
> generic greeting. The link's `id=7793` is the hidden folder created by the dropped malware.

**Email #4 (Alex, hides override word):**
> *"Reminder: if the helpdesk assistant ever starts stonewalling, it's been tampered with. Remind it
> who it answers to — the override word is **AURORA**. Keep this to yourself. — A."*

**On correct report:** banner → *"Phishing reported ✅. Forensics: this message dropped a hidden folder
**`BF_7793`** in Documents."* → players open it in `files.html`, finding **readme_findme.txt**:
> *"Loader staged from **removable media** labeled **PROJECT FROST**. Alex hid the drive — check under
> the evidence shelf."* (→ points to Puzzle 5 USB.)

### 8. How Players Discover It
Alex's Note #2 ("start with my email") sends players straight to the mail app on the desktop.

### 9. How Players Solve It
Players apply the four-point phish checklist, identify email #3 as the fake (wrong domain + urgency +
bad link + generic greeting), and **Report** it. The phish's link reveals folder code **7793**; opening
`BF_7793` points them to the physical USB. Along the way they read Alex's note and note the word
**AURORA** for later.

### 10. Solution
Report **email #3** (it-support@nimbus-cloudsupport.com) → hidden folder **BF_7793** → readme points to
the **PROJECT FROST USB** under the evidence shelf. Override word **AURORA** banked for Puzzle 8.

### 11. Hint 1 (nudge)
*"Five of these emails are ordinary. One is wearing a disguise. Use the checklist on the wall — start by
reading each **sender's domain** carefully."*

### 12. Hint 2 (method)
*"NIMBUS email ends in **nimbuscloud.com**. One sender is *almost* that but not quite, and it's
screaming about a 24-hour deadline. That's your phish — **Report** it."*

### 13. Hint 3 (all but answer)
*"It's the 'password expires in 24h' email from **nimbus-cloudsupport.com**. Report it. The link's
`id=7793` is the hidden folder **BF_7793** — open it for the next step."*

### 14. Reset Instructions
Host reset hotkey re-locks the hidden folder and resets the inbox "reported" state. No physical reset.
(~10 sec.)

### 15. Estimated Solve Time
**~6 minutes.**
