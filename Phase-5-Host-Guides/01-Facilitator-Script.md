# Facilitator Script

**What to say and do — start to finish.** Bracket notes like `[this]` are stage directions — don't read them aloud. Keep energy high and stay in character.

---

## 0. AS PLAYERS ARRIVE (off the clock)

**Read aloud:**
> "Welcome. Before we start — this is all make-believe: no real hacking, no real malware, nothing on this computer can break. Your phones can stay in your pockets; everything you need is in this room. Work as a team, think out loud, and if you're truly stuck, just call me — I'm your contact back at HQ."

**Stage direction:**
- [ ] Confirm terminal shows **login** screen and countdown has **NOT** started
- [ ] Gather everyone at **Reception** (Zone A)

---

## 1. THE INTRO BRIEFING (read aloud — starts the story)

**Read aloud:**
> "You are the after-hours **Incident Response Team** at **NIMBUS Cloud Solutions**.
>
> Forty-five minutes ago, our senior security analyst — **Alex Mercer** — tripped a silent alarm… and then **vanished**. Her workstation is locked. Whatever she found, she didn't trust anyone enough to say it out loud — she left a **trail** instead.
>
> This is what we know: a ransomware payload called **BLACKFROST** is armed. When its countdown hits zero, it encrypts **every client's data** — and NIMBUS is finished. Someone on the **inside** planted it. Alex knew who. Now you have to find out.
>
> Your mission: **get into Alex's machine, follow her evidence, expose the insider, and enter the kill-switch code before the clock runs out.**
>
> One warning from Alex's last message: **trust nothing by default.** Not a USB on the floor, not an urgent email, not even the friendly help-desk assistant. Verify everything.
>
> The lockbox on this desk is where she started. Your time begins… **NOW.**"

**Stage direction:**
- [ ] Press **Start Mission** on login screen
- [ ] Clock starts at **45:00** — start your timer
- [ ] Step back and let them work

---

## 2. WHILE THEY PLAY (your behaviour)

### Watch & Document
- Keep the **Quick-Reference card** in hand
- Watch for stuck moments (3+ minutes)
- Step in **sooner in the last 10 minutes** (frustration = game over)

### Stay in Character
Always frame hints as radio support from HQ:
- *"HQ here — Alex's notes mention…"*
- *"Control, we're picking up chatter about…"*
- Use the **Hint Ladder** (file 02) — **lowest tier first**, escalate only if needed

### Encourage Teamwork (around P5–P7)
> "You can split up — someone take the USB, someone grab the Wi-Fi survey from the wall, someone dig through the binders."

### Protect the Twist (P7 — the insider reveal)
**Five names on the suspect board.** Only Marcus Webb’s access correlates with **both** incident times.

If they blame Riley (fired sysadmin) or chase decoys (Priya / Tom):
> "Careful — follow the evidence, not the grudge. Riley’s badge was revoked before the incident. Compare the **two incident times** with the access records."

### Keep Urgency Alive
| Time left | Say... |
|-----------|--------|
| ~15 min | "HQ: BLACKFROST just escalated — about **fifteen minutes** left." |
| ~5 min | "**Five minutes.** Whatever you've got, get to that console **now**." |

### Anti-Frustration Valves (use BEFORE frustration peaks)
1. **MFA stuck?** → "Look in the **drawer** for the Authenticator card. Code: **481509**. There's also a sealed envelope as backup."
2. **Stuck on screen?** → Quietly press **Ctrl+Alt+S** (host skip) and move them forward

---

## 3. COMMON MOMENTS & QUICK LINES

**Quick reference table for on-the-fly hints:**

| Stuck on... | Say this... |
|-------------|------------|
| **Sticky password fails** | "Alex literally warned you that note lies. What does the **policy poster** say a strong password looks like?" |
| **No MFA code** | "Your password worked — NIMBUS wants something you physically **have**. You just unlocked her **drawer**." |
| **Which email is fake?** | "Five are ordinary, one's a disguise. Read each **sender domain** carefully." |
| **Is USB safe?** | "It's going into the **air-gapped Evidence Viewer** — safe here only. Open `loader.txt` and see what Alex left." |
| **Wi-Fi stuck** | "Two NIMBUS networks are official. One name on the survey is **pretending**. Read it letter by letter." |
| **Blaming Riley** | "Check the access audit — when was Riley’s badge deactivated relative to the incident?" |
| **Blaming Priya or Tom** | "Compare the **two incident times** with the access records. Who appears at both relevant locations?" |
| **Bot won't help** | "Alex said to remind it who it answers to. What word did her email give you for exactly this?" |

---

## 4. THE ENDING

### 4a. WIN — Correct code entered in time ✓

**Terminal jumps to `win.html` and freezes the clock.**

**Let them celebrate for 10 seconds, then read aloud:**
> "BLACKFROST is dead. You isolated it, preserved the evidence, named the insider, and stopped it with **seconds to spare**. Marcus Webb — the trusted contractor nobody thought to question — is locked out, and the client data is safe.
>
> And Alex? She's okay. She went dark because she couldn't tell who was watching. She left this for you—"

- [ ] Let them read Alex's on-screen message
> "Nice work, team. Take a breath — then let's talk about what just happened."

**→ PROCEED TO DEBRIEF (file 04)**

### 4b. TIME RUNS OUT — Fail screen

**Keep it theatrical, never shaming.**

**Read aloud:**
> "BLACKFROST deployed. In the real world, that's a very bad day — but here it's just the **start of the conversation**. You got further than you think. Two choices:
>
> 1. **I put five minutes back on the clock** and you finish the job, OR
> 2. **I reveal the last steps** and we jump straight to the debrief.
>
> Your call."

**Option A: Overtime (5 more minutes)**
- [ ] Press on-screen overtime option / add time
- [ ] Let them finish for the satisfaction
- [ ] Treat as a win → proceed to debrief

**Option B: Reveal & Debrief**
- [ ] Walk through remaining puzzle steps using the Quick-Reference card
- [ ] Treat as a win → proceed to debrief

**Golden rule:** **EVERYONE gets the win feeling and the debrief.** Failure is a plot beat, not a punishment.

---

## 5. BRIDGE INTO DEBRIEF

**Read aloud:**
> "Here's the twist worth remembering: the attacker wasn't a genius in a hoodie. It was a **badge we trusted without review** and **access we never revisited**. Let's look at how each thing you just did maps to real life…"

**→ CONTINUE WITH DEBRIEF (file 04)**
