# FOOTHOLD / The Launch — playable concept

Standalone English-language browser prototype. BLACKFROST and its production data are not changed.

## Run

From this directory:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766. No build, dependencies, remote APIs or external assets are required. Opening `index.html` directly also works, but browser session-storage behaviour on file URLs varies.

## Scope

- A 15-minute vertical slice: three investigations, simulated marker placement, containment and an automatic debrief.
- Visual evidence first: a message-source chain, venue cards and session timeline, and an app-permission matrix. Supporting control records and extended explanations are available in expandable details.
- The lanes can be solved in any order on one shared browser. This is **not multi-device multiplayer**.
- Progress is stored in this tab's session storage; replay is allowed. No registration, host control, server enforcement, ranked scores or production one-attempt restrictions.
- Hints cost 25 demo points each. After five minutes without a verified finding, help is offered, not revealed. The timer continues while investigating or reading the briefing after starting.
- Score on success: `max(0, 500 + 10 * whole minutes remaining - 25 * hints requested)`.
- Everything is pre-scripted. There is no malware, payload upload, executable content, network probing or real authentication. The simulation makes no external requests.
- Solutions and local state are inspectable. Do not use this as a secure assessment or reuse its client-side validation for production scores.
- Covers a subset of the proposed curriculum; references to other working controls are not substitutes for full playable coverage.

## Facilitator / spoilers

1. **People:** Vera Chen; A-04 signed agreement; R-08 duty roster.
2. **Place:** P2 escorted partner desk; existing session not revoked.
3. **Platform:** G-17 PreviewBridge; package.write.
4. **Route:** ATLAS press package / staging; P2 release session / G-17.
5. **Containment:** revoke G-17 and reissue preview-only access.

The test identity is authorised to use P2 during an escorted assessment. Physical access alone does not grant system access. A release approval is distinct from the ability to edit a package.

## Before production

Specify and playtest the remaining curriculum, add scenario-aware server state and authenticated host access, connect registration and one-attempt rules, validate accessibility and team play, and measure costs against the shared free-tier budget. This prototype is not deployed to the public site.
