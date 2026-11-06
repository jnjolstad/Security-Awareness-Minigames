# Preflight checklist for Azure migration (prepare-only)

Status legend: `[ ]` not done, `[x]` done, `[n/a]` not applicable.

## 1) Scope lock

- [ ] Confirm scope is **mini-games only** (`Website/security-awareness-month/minigames` + mini-games API).
- [ ] Confirm escape-room and other site features are explicitly out of scope.
- [ ] Confirm no production cutover in this phase.

## 2) Source integrity

- [ ] Repo baseline tagged (for example `pre-azure-prep`).
- [ ] Branch protection enabled on `main`.
- [ ] Required files present:
  - `Website/security-awareness-month/minigames/catalog.js`
  - `Website/security-awareness-month/minigames/board.js`
  - `Website/functions/security-awareness-month/minigames-api/[[path]].js`
  - `Website/functions/security-awareness-month/_minigames-key.js`

## 3) Data and retention

- [ ] Decide whether historic leaderboard data must be migrated.
- [ ] Decide retention for players/runs in Azure target.
- [ ] Confirm legal/privacy owner for nickname and score data.

## 4) Identity/admin model

- [ ] Confirm global admin identities (email/group-based).
- [ ] Confirm group-admin model requirements (if enabled in this version).
- [ ] Confirm handling for non-admin users remains anonymous nickname flow.

## 5) Runtime target decisions

- [ ] Frontend host selected (Azure Static Web Apps or Storage+CDN).
- [ ] API runtime selected (Azure Functions Node.js).
- [ ] Database selected (Azure SQL / PostgreSQL / Cosmos).
- [ ] Secret store selected (Key Vault + managed identity).

## 6) Observability and ops

- [ ] App Insights workspace identified.
- [ ] Error alert policy defined (5xx rate + latency thresholds).
- [ ] Rollback owner and rollback window defined.

## 7) Release strategy

- [ ] Staging environment name reserved.
- [ ] Synthetic test script defined for board/start/finish endpoints.
- [ ] DNS cutover plan drafted (not executed).

