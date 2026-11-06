# Phase 4 — Printable Artifacts & Props

> Every physical artifact for BREACH PROTOCOL, ready to print. Each file is a self-contained
> **print-ready HTML page** — open it in a browser and click **Print** (or `Ctrl+P`).
> A grey on-screen **host bar** explains each item; it never prints.

---

## How to print

1. Open any `.html` file in this folder (double-click → opens in your browser).
2. Click the **Print** button (top-right) or press **Ctrl+P**.
3. In the print dialog: **Paper = A4**, **Margins = Default/None**, and **turn ON “Background graphics”**
   (Chrome/Edge: *More settings ▸ Background graphics*) so colours and panels print.
4. The grey host instructions and Print button are automatically hidden on paper.

**Recommended stock:** plain paper for documents/posters; **cardstock** for the ID badges, the
authenticator token, the nameplate, and the folder labels (they’re handled a lot). Colour printing makes
the posters and the red/green/amber cues pop, but everything is still solvable in black & white.

> Tip: select all the `.html` files, open them, and print in one sitting. Total ≈ **20 sheets**.

---

## What to print — master checklist

| # | File | Artifact | Puzzle | Copies | Colour? | Goes where |
|---|---|---|---|---|---|---|
| 1 | [01-visitor-policy-poster.html](01-visitor-policy-poster.html) | Visitor Policy poster (A2) | 1 | 1 | ✅ | Wall above reception desk |
| 2 | [02-visitor-log.html](02-visitor-log.html) | Visitor Sign-In Log (A1) | 1 | 1 | ⬜ | Clipboard/binder on reception desk |
| 3 | [18-alex-notes.html](18-alex-notes.html) | Alex’s Notes #1 & #2 | 1 & 3 | 1 (cut 2) | ⬜ | #1 in lockbox · #2 in desk drawer |
| 4 | [03-passphrase-policy-poster.html](03-passphrase-policy-poster.html) | Passphrase Policy poster (B1) | 2 | 1 | ✅ | Wall by the workstation |
| 5 | [04-desk-props.html](04-desk-props.html) | Sticky, 4 dot-labels, nameplate, USB label | 2 & 5 | 1 (cut) | ✅ | Sticky on monitor · labels on objects · nameplate on desk · label on USB |
| 6 | [05-authenticator-and-mfa.html](05-authenticator-and-mfa.html) | Authenticator token (B2) + recovery envelope (B3) | 3 | 1 (+spare envelopes) | ✅ | Token in desk drawer · sealed envelope in drawer |
| 7 | [06-spot-the-phish-poster.html](06-spot-the-phish-poster.html) | “Spot the Phish” poster (C1) | 4 | 1 | ✅ | Wall by the PC |
| 8 | [07-phishing-email-print.html](07-phishing-email-print.html) | Phishing email printout (C2) — *optional* | 4 | 0–1 | ⬜ | Optional desk prop |
| 9 | [08-network-diagram-poster.html](08-network-diagram-poster.html) | Network Map poster (C3) | 6 | 1 | ✅ | SOC wall |
| 10 | [09-wifi-survey.html](09-wifi-survey.html) | Wi-Fi Site-Survey (C4) | 6 | 1 | ✅ | SOC wall, beside C3 |
| 11 | [10-badge-access-log.html](10-badge-access-log.html) | Badge Access Log (D2) | 7 | 1 | ⬜ | Evidence binder on shelf |
| 12 | [11-contractor-hr-binder.html](11-contractor-hr-binder.html) | Contractor/HR register (D3) | 7 | 1 | ⬜ | Evidence binder on shelf |
| 13 | [12-data-classification-poster.html](12-data-classification-poster.html) | Data Classification poster (D4) | 7 | 1 | ✅ | Wall above the 3 folders |
| 14 | [13-cloud-exfil-alert.html](13-cloud-exfil-alert.html) | Cloud Exfil alert (D5) | 7 | 0–1 | ✅ | **Host station; release only after correct accusation** |
| 15 | [14-red-herring-riley.html](14-red-herring-riley.html) | Riley termination notice + angry sticky (D6) | 7 | 1 (cut) | ⬜ | Evidence shelf / corkboard |
| 16 | [15-classification-folder-labels.html](15-classification-folder-labels.html) | 3 folder labels (green/amber/red) | 7 | 1 (cut) | ✅ | Stick on the 3 folders |
| 17 | [16-suspect-badges.html](16-suspect-badges.html) | ID badges: Webb/Tran/Cole/Nair/Baxter/Mercer (6 cards) | 7 | 1 (cut) | ✅ | Suspect board / corkboard |
| 18 | [17-parking-lot-photo.html](17-parking-lot-photo.html) | Parking-lot USB photo (D1) — *optional* | 5 | 0–1 | ✅ | SOC wall (atmosphere) |
| 19 | [19-room-branding.html](19-room-branding.html) | Door sign + awareness poster | all | 2 | ✅ | Entrance + walls |

*(File `print.css` in `assets/` is the shared style — don’t print it.)*

---

## Answer-bearing artifacts (host quick-reference) ⚠️ spoilers

Most printables are atmosphere; these are the ones that actually carry a code or the key logic — handle
placement carefully:

- **Visitor Log (A1)** → only **J. Price / V-2071** breaks all 3 rules → lockbox **2071**.
- **Desk props (B-set)** → dot order 🔴🟢🔵🟡 = **rocket cactus car lightning bolt**. Sticky `Summer2023!` is the decoy.
- **Authenticator token (B2)** → MFA **481509** (recovery envelope holds the same).
- **Wi-Fi Survey (C4)** → rogue **NIMBUS_5ecure** @ **Desk 14**.
- **Access Audit (D2)** → **EXT-4471 (Webb)** correlates with both incident times; **Riley deactivated** = cleared.
- **Cloud Exfil alert (D5)** → token **EXT-4471**, bucket **frost-vault-882** → fragment **882**.
  This is gated in-app; do not leave the optional printout accessible before the accusation.
- *(AURORA and NORTHSTAR are on-screen only — no printable.)*

> The full master answer key lives in `Phase-2-Puzzles/00-Phase-2-Overview-and-Answer-Key.md`. Never print
> that, or this section, for players.

---

## Placement map (by room zone)

```
ENTRANCE ─ door sign (19)
RECEPTION ─ Visitor Policy poster (01) · Sign-In Log (02) · lockbox{key + Alex Note #1 (18)}
WORKSTATION ─ Passphrase poster (03) · decoy sticky + dot-labels + nameplate (04)
              desk drawer{ Authenticator token + sealed envelope (05) · Alex Note #2 (18) }
              "Spot the Phish" poster (06) · optional phish print (07)
SOC WALL ─ Network Map (08) · Wi-Fi Survey (09) · optional parking-lot photo (17) · awareness poster (19)
EVIDENCE SHELF ─ binder{ Badge Log (10) · Contractor/HR (11) } · red-herring (14) · PROJECT FROST USB
                 Data-Classification poster (12) over 3 context folders{ labels (15) }
HOST STATION ─ optional Cloud Exfil printout (13), released only after a correct accusation
                 suspect board{ ID badges (16) }
```

(Full zone diagram is in `Phase-1-Design/02-Room-Layout.md`.)

---

## Reset note

All printed props are reusable. Between groups you only re-position them (relock lockbox, re-stick the
sticky, re-tape the USB, put Note #1 back in the lockbox, return the token to the drawer, re-file the
exfil alert at the host station). The **only consumable** is the sealed “break glass” MFA envelope — print a
few spares so you can reseal it. Full reset checklist comes in **Phase 5**.

---

### Phase 4 complete.
Next (**Phase 5**) are the host-facing guides: facilitator script, hint ladder, reset checklist, and a
debrief guide that maps every puzzle to its real-world lesson. Approve to proceed.
