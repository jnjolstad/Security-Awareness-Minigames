# 01 — Storyline

> *Genre: corporate cyber-thriller / detective investigation.
> Tone: tense but not horror. Think "after-hours office, one desk lamp on, a clock ticking."*

---

## Logline

A security analyst vanished the moment she uncovered a breach. The ransomware she found goes live
in under an hour. She left the only people who can stop it — **you** — a trail of clues hidden in
her office. Find the insider. Enter the kill switch. Save the data.

---

## Setting

**NIMBUS Cloud Solutions** — a mid-size cloud hosting company whose tagline is *"Your Data. Always
Up."* NIMBUS stores sensitive files for thousands of client businesses, which makes it a juicy
target. The game takes place **after hours on a Friday** in the corner of the office belonging to
the Security Operations Center (SOC).

The lights are low. One workstation is still logged-off and locked. A coat is still on the chair.
Whoever sat here left in a hurry — but not without thinking ahead.

---

## The company (world-building anchors)

| Element | Detail |
|---|---|
| Company | NIMBUS Cloud Solutions |
| Motto | "Your Data. Always Up." |
| Player team | NIMBUS After-Hours Incident Response Team (that's you) |
| The product | Cloud storage for client businesses (so a breach = clients' data at risk) |
| Internal systems | NIMBUS Secure Terminal (NST), the badge access system, the SOC dashboard |
| The threat | **BLACKFROST** — a ransomware payload set to encrypt all client data on a timer |

---

## Cast of characters

### The hero you never meet — **Alex Mercer**, Senior Security Analyst
Alex noticed small anomalies for weeks: odd logins, a strange Wi-Fi network, a USB nobody claimed.
When she confirmed a breach was active, she realized the attacker was **inside** the company and
might be watching her screen. So she did something clever: instead of sounding an alarm the insider
could intercept, she **hid the evidence in plain sight** across her office and disappeared to a safe
location, trusting the response team to follow the trail. Alex is the "voice" of the game — players
read her notes, her emails, and finally hear how the story ends.

### The villain — **Marcus Webb**, IT Support Contractor *(the insider)*
Marcus has been NIMBUS's friendly outsourced IT contractor for three years. Everyone treats him like
staff. He fixes printers, resets passwords, and **nobody questions him** when he's in the server room
after hours. That over-trust is exactly how he did it: his legitimate contractor badge was never reviewed, he dropped a
malicious USB, stood up a rogue Wi-Fi access point to harvest credentials, phished an employee, and
quietly copied **Confidential** client data to a personal cloud bucket before planting BLACKFROST as
cover. Marcus is the lesson: **insider threats are often the people we trust the most, including
third-party vendors.**

### The red herring — **Riley Tran**, recently terminated Sysadmin
Riley was fired two weeks ago and left angry — the *obvious* suspect. Players will be tempted to
blame Riley. But the evidence (a deactivated badge, an access log that predates the attack) proves
Riley **couldn't** have done it. Lesson: don't jump to the obvious insider; **follow the evidence.**

### The bystander — **Dana Cole**, Helpdesk Technician
Dana is innocent but is the employee who got **phished** — their clicked link gave Marcus an initial
foothold. Dana's mistake is relatable, not villainous (lesson: anyone can be phished; what matters is
**reporting it**).

---

## Backstory — how the breach actually happened (the truth players reconstruct)

This is the hidden timeline. Players don't read it as text — they **rebuild** it from clues. It's
documented here so every artifact in later phases stays consistent.

1. **Foothold (Phishing).** Marcus sent Dana a spoofed "IT Password Expiry" email. Dana clicked and
   entered credentials on a fake portal. (Puzzle 4 — *The Bait*.)
2. **Credential harvesting (Rogue Wi-Fi).** Marcus also ran a rogue access point named to mimic the
   corporate network, capturing more logins from people who connected to the wrong SSID. (Puzzle 6 —
   *Ghost Signal*.)
3. **Lateral movement (USB + trusted access).** Marcus used his unreviewed contractor access to enter
   the secure SOC area and left/used a malicious USB to run his tools. (Puzzles 1 & 5.)
4. **Exfiltration (Data classification + cloud).** He located the **Confidential** client files and
   copied them to a personal cloud storage bucket. (Puzzle 7.)
5. **Cover & ransom (BLACKFROST).** He planted ransomware set to detonate on a timer — partly to
   destroy evidence, partly to extort NIMBUS. (Finale.)
6. **Discovery & the trail (Insider threat + AI tampering).** Alex spotted it, realized it was an
   insider, and hid clues. Marcus had tampered with the helpdesk **AI assistant** to mislead responders,
   so Alex left a phrase that would override his hidden instruction.
   (Puzzle 8.) Alex then went dark and left the kill switch for the team. (Finale.)

---

## The player's mission (as briefed at the start)

> *"This is the NIMBUS After-Hours Incident Response Team. Forty-five minutes ago, Senior Analyst Alex
> Mercer triggered a silent duress alert and went off-grid. Her last message: 'It's one of us.
> BLACKFROST is real. Everything you need is in my office. Don't trust the assistant. Stop it in time.'
> The deployment timer is already running. Get into her terminal. Find the insider. Enter the kill
> switch. Go."*

Players' objectives, in order:
1. **Break in** to Alex's locked workstation (physical access).
2. **Authenticate** as Alex (password + MFA).
3. **Trace the attack** through her hidden evidence (phishing, USB, Wi-Fi, logs).
4. **Unmask the insider** — and clear the innocent.
5. **Disarm BLACKFROST** with the kill-switch code before the countdown ends.

---

## The twist

The team may accuse **Riley Tran** (the fired, angry sysadmin). The mid-game
"gotcha" is the moment the access audit proves Riley's badge was revoked *before* the attack began —
forcing the team to look again. The real culprit, **Marcus Webb**, is the person everyone trusted and
whose access nobody reviewed: the contractor. The final reveal confirms it and lands the headline lesson —
**trust, but verify; insiders include your vendors.**

---

## Win & lose conditions

- **WIN:** Players identify Marcus Webb, assemble the kill-switch code from three discovered fragments
  (his contractor ID + Alex's kill phrase + a data fragment), and enter it into the BLACKFROST console
  before the timer ends. The screen flips to a success state; Alex sends a final "you got him — and I'm
  safe" message; the data is saved.
- **LOSE (soft fail):** If the timer reaches zero, BLACKFROST "detonates" on screen (dramatic but
  harmless). The host then offers a 5-minute overtime or reveals the solution. *Failure is theatrical,
  never punishing* — Security Awareness Month should end on a positive, "here's what we learned" note.

---

## The closing reveal (read/aired at the end)

> *"Incident contained. The intruder wasn't a hacker in a hoodie — it was Marcus Webb, our IT
> contractor. He had a badge we trusted without review, access we never revisited, and trust he exploited.
> I'm safe. I went dark because I couldn't tell who was watching. You followed the trail, you didn't
> blame the easy target, and you stopped BLACKFROST with seconds to spare. That's exactly how real
> incident response works. — Alex."*

This is the moment the host transitions into the **debrief**: a 5-minute walk back through which
real-world security behavior each puzzle represented (delivered in Phase 5).

---

## Narrative principles (kept throughout)

- **Show, don't tell.** Players reconstruct the story from artifacts; the game never lectures.
- **No villain on screen.** The threat is a countdown and a trail, which keeps it tense, not scary.
- **Every clue is diegetic.** Posters, logs, emails, and notes are things that would *really* exist
  in this office.
- **Relatable mistakes, not stupid ones.** Dana's phish and the unchecked contractor are believable —
  that's what makes the lessons stick.
