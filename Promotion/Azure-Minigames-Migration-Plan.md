# Azure migration plan: mini-games only

Prepared: 6 November 2026  
Status: proposal; no infrastructure, data or production traffic has been changed.

## 1. Goal

Move the ten Security Awareness Month mini-games, their hub, leaderboard and supporting API from the private njolstad.no setup to company-owned source control and Azure hosting.

Assumption: "new source" means an **Azure Repos repository in Azure DevOps**, with an Azure deployment pipeline. Company GitHub can be substituted without changing the application architecture.

**Out of scope:** the physical and digital escape rooms, registration, bookings, team codes, email, host tools, prototypes and unrelated njolstad.no applications. These stay where they are.

## 2. Preserve the current experience

- All ten games, photos, hints, debriefs and NSM references.
- Existing hub and per-game/championship leaderboard.
- Random suggested nicknames that players can replace with their own.
- No mandatory player login, plus unranked play.
- Server-calculated scores, first-attempt scores and current tie-breaking.
- Per-run shuffled layouts and answer ordering.
- Company login for administrators who can remove players/scores.

Do not introduce compulsory employee SSO, different scoring or new game content as part of the hosting migration.

## 3. Inventory and source extraction

Use the current `jnjolstad/SecurityAwarenessMonth` repository as the source of truth. Reconcile any older local export folders before migration so `Website` and `functions` stay aligned.

| Include | Purpose |
|---|---|
| `security-awareness-month/minigames/**` | Hub, ten games, leaderboard, shared engine, images, icon and link-preview image |
| `functions/security-awareness-month/minigames-api/[[path]].js` | Player, start, finish, board and administrator operations |
| `functions/security-awareness-month/_minigames-key.js` | Generated server scoring key |
| `scripts/build-minigames-key.mjs` | Regenerate the key from the shipped game content |
| Mini-game-specific tests and promotion material | Verification and updated launch links |
| Only shared assets actually referenced by the above | Avoid copying unrelated private apps |

Inventory exact API methods and paths from the existing dispatcher before porting. Extract relevant routing/header rules, but **replace** private shared authentication rather than copying the site's users, passwords or admin email list.

Current storage is Cloudflare D1 through `AUKSJON_DB`:

- `sam_mg_players`: nickname, normalized name, player ID and credential hash.
- `sam_mg_runs`: ranked run ID, player, game and server start timestamp.
- `sam_mg_best`: per-game best, duration, penalties, attempts, achievement time and first-attempt score.

Export only these application tables. The database is shared with unrelated applications.

Suggested repository:

```text
security-awareness-minigames/
  web/
    security-awareness-month/minigames/
  api/
    minigames/
    auth/
    storage/
  scripts/
    build-minigames-key.mjs
    migration/
  infra/
  tests/
  docs/
```

## 4. Proposed Azure architecture

| Responsibility | Proposed service |
|---|---|
| Source and CI/CD | Azure Repos and Azure Pipelines |
| Static frontend | Azure Static Web Apps |
| API | Separate Node.js Azure Function App |
| Leaderboard/player/run storage | Azure SQL Database |
| Administrator identity | Microsoft Entra ID with an application role assigned to an approved group |
| Secrets/configuration | Key Vault and application settings; managed identity where supported |
| Monitoring | Application Insights and Azure Monitor |
| Address | Company-owned hostname |

Azure SQL supports the unique nickname constraint, transactions and relational leaderboard queries. It is **not** a drop-in replacement for D1's SQLite queries: schema, upserts and ranking queries need porting.

Keep test and production resources separate. Preserve the existing website paths initially to minimize frontend changes.

### Platform and budget gate

Before provisioning, check current Static Web Apps plan requirements for linking a separate Function App, supported Functions hosting plans, region availability, networking and Entra configuration. Do not assume those features are available on the free plan.

If that combination is unsuitable, use Azure App Service for both static files and the API under one origin.

Azure is **not guaranteed to remain free**. Cost SQL, hosting, telemetry and networking for expected traffic in the approved company region. Set budget alerts and log-retention limits; budget alerts are notifications, not a spending cap.

Serverless database auto-pause and Functions cold starts may affect timed games. Choose hosting based on measured responsiveness, not only the cheapest idle configuration.

## 5. Implementation work

### Frontend

- Copy existing pages and assets without redesigning the games.
- Configure the API endpoint and company base URL.
- Update canonical/Open Graph URLs, icon/image references, navigation and promotional links.
- Define Azure routes for clean URLs, trailing slashes and API methods.
- Preserve response/cache rules. Do not add a blanket SPA fallback to this multi-page site.
- Keep the generated answer key outside the publicly served static output.

### API and SQL

- Extract current scoring and shuffle logic from the Cloudflare request/storage adapters.
- Port handlers to Azure Functions without changing their JSON contracts.
- Translate schema, unique constraints, upserts and ranking queries to SQL Server.
- Make ranked completion transactional: validate ownership and expiry, consume the run once, and update score/attempt/first-score records atomically.
- Preserve ranking: score descending, duration ascending, then achievement time.
- Preserve penalties, server timing, latency grace, minimum action timing, cooldown, expiry and log limits.
- Keep normalized nickname uniqueness, name validation and explicit duplicate-name errors.
- Preserve nickname-creation throttling. Replace Cloudflare IP-header assumptions with a trusted Azure ingress source; do not trust arbitrary forwarded headers from clients.
- Preserve hashed player credentials and authorized administrator deletion.
- Use bounded connection pooling and deployment-time database migrations instead of request-time schema creation.
- Add expiry cleanup for old run records; expired runs must be rejected whether or not cleanup has executed.

### Administrator access

Use a tenant-restricted Entra application and an application role such as `Minigames.Admin`, assigned to an approved company group.

Enforce the role on the API, not just by hiding the Remove button. Validate token signature, issuer, audience and role, or use an authenticated platform ingress whose identity headers cannot be spoofed through direct API access.

Keep player registration, run and board routes public as they are today. Do not migrate private administrator sessions or passwords.

## 6. Scores and browser identity

Recommended default: preserve the existing leaderboard and first-attempt history, while letting in-flight runs finish before cutover rather than transferring them.

### Data transfer

1. Export only `sam_mg_players`, `sam_mg_best` and any explicitly retained run records.
2. Preserve IDs, normalized names, credential hashes, scores, duration, penalties, attempts, first-score and achievement timestamps.
3. Import into the test database and compare counts, uniqueness, orphan records and every leaderboard.
4. Do not fabricate a first-attempt score where historical data is missing.
5. Encrypt and restrict exports. Never commit them to the repository.
6. Decide company retention for nicknames, credential hashes, IP hashes and run records; document it in the privacy notice.

### A new hostname does not inherit localStorage

Player credentials, local bests and saved state belong to the njolstad.no browser origin. Importing the database does not let players on the new hostname automatically reclaim their old nickname.

Choose one tested approach before cutover:

- **Fresh campaign:** retain old scores read-only or archive them, and clearly tell participants that new nicknames/identities are needed. Decide how historical names are reserved or namespaced.
- **Preserve identity:** add an explicit transfer flow on the old site. After verifying possession of the player's existing credential, issue a short-lived, single-use token. Redeem it on the new origin and rotate the player credential. Do not put raw keys in URLs, analytics or logs.

For an active campaign with competitive scores, preserving identity is preferable, but requires additional implementation. Historical local bests can be reset separately; do not silently award a new "first try" to an imported player.

## 7. Phases and indicative effort

| Phase | Deliverable / exit gate | Effort |
|---|---|---|
| 1. Confirm ownership and architecture | Production inventory, company repository/region/domain, budget, identity/data decision | 1 day |
| 2. Extract source and CI | Standalone repository, reproducible asset/key build, unrelated apps excluded | 1 day |
| 3. Azure spike | One game and a seeded board working in test; Entra admin and deployment verified | 1-2 days |
| 4. Port backend | SQL schema and API contracts; scoring, concurrency and authorization tests pass | 3-5 days |
| 5. Migration rehearsal | Data/ranking parity, identity continuity, timing and browser verification | 1-2 days |
| 6. Cutover and handover | Final import, production checks, updated links, monitoring and rollback runbook | 1-2 days |

Allow approximately **2-3 working weeks for one developer**, plus company access/domain approvals. Re-estimate after the spike, particularly if identity transfer or enterprise network restrictions are required.

## 8. Acceptance checklist

- All ten games load; photos, hotspots, hints, debriefs and NSM links work.
- Random suggestions are editable; custom names persist and duplicate/invalid names show clear errors.
- Unranked play works without login or database registration.
- Browser/server scoring parity holds for shuffled answers, penalties, expiry and replay.
- First-score remains unchanged on subsequent attempts.
- Imported per-game and championship rankings match source output, including ties.
- Concurrent finish requests cannot score the same run twice.
- Anonymous/non-admin users cannot remove players or access admin-only operations.
- Admin sign-in and removal work with the company role.
- Clean URLs, link previews, desktop/mobile layouts and cache headers work on the new hostname.
- Cold/warm timing and peak load are tested. Provisional target: p95 under one second for start/board requests under representative load, with zero hangs/timeouts in a 50-request concurrent smoke test. Revisit hosting if cold starts compromise this.
- The pipeline regenerates the key from the same game files being deployed, keeps secrets out of artifacts and can deploy the previous release.
- Data migration and browser identity behavior are verified end to end.
- The escape-room site and unrelated private applications remain unaffected.

## 9. Cutover and rollback

1. Announce the new URL and the agreed nickname/score-continuity behavior.
2. Freeze new ranked starts, new player registration and admin deletion on the old mini-game API.
3. Let active ranked runs finish within a bounded window, then freeze all old writes.
4. Take final backups/exports and import into Azure.
5. Verify leaderboard parity and production gameplay before switching links.
6. Redirect only the old mini-game website routes. Do not redirect POST API requests blindly; stale clients should receive an explicit moved/maintenance message.
7. Retain a narrowly scoped identity-transfer route temporarily if chosen.
8. Update mini-game promotion links and observe latency, errors and scores after launch.

Retain the last working Cloudflare release and export for an agreed rollback window.

If Azure has accepted new scores, **do not simply reopen the old API**: freeze Azure and reconcile those writes first, or keep both read-only during recovery. Two writable systems would split leaderboard history.

After owner acceptance, delete only the migrated `sam_mg_*` data and retire only mini-game-specific routes, with explicit approval. Do not delete the shared D1 database, KV resources, escape-room functions or unrelated website services.

## 10. First step with IT

Request:

- Company Azure DevOps project/repository and deployment permissions.
- Test resource group, approved region and indicative budget.
- Company hostname and public-access policy.
- Entra administrator group/application role.
- Data retention and existing-score/identity continuity decision.
- Named technical owner, support contact and cutover approver.

Then prove one mini-game plus the API and a seeded leaderboard in Azure test before migrating the remaining games.

This mini-game-only plan supersedes the broader draft made earlier in this conversation. It does not replace the separate escape-room migration plan.
