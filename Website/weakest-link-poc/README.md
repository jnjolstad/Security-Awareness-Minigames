# WEAKEST LINK — practice prototype

A timed 10-minute "think like an attacker" exercise. Standalone and client-side only; nothing is sent anywhere.

## Run

```
python -m http.server 8767
```

Open http://127.0.0.1:8767/.

## Flow

1. **Find the openings.** Press Start (10:00 countdown), then click objects in a photo of a fictional office. 8 are openings, the rest are fine. At least 5 are needed to continue.
2. **Break the chain.** Three short attack stories. Pick the single step that stops each one.
3. **Debrief.** Score breakdown, found and missed openings, three habits, and the authorisation reminder. If the timer runs out, the game jumps here.

Score: +1 per second left, −25 per wrong click (decoys, empty spots, repeats and wrong chain answers), −100 per hint, −100 per opening not found. Openings and chains give no points; they protect your score. Max 600, minimum 0.

`office.jpg` is generated with Gemini. Hotspot boxes in `game.js` use its 1376×768 pixel coordinates.

## Topics covered

Physical access, visitors, social engineering, recon and data classification, clean desk, device and session security, passwords, MFA fatigue and reporting, removable media.

## Not in scope

No host view, team play or server-side scoring. Answers are visible in `game.js`. Progress is kept in sessionStorage for the current tab only.
