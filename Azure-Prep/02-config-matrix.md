# Config matrix (Cloudflare source -> Azure target)

This is a prepare-only mapping sheet. Fill the "Target value" column before any migration implementation.

| Area | Current/source | Azure target key | Target value | Notes |
|---|---|---|---|---|
| Mini-games API base path | `/security-awareness-month/minigames-api` | `MINIGAMES_API_BASE_PATH` |  | Keep path stable during transition if possible. |
| DB binding name (Cloudflare) | `AUKSJON_DB` | `AZURE_SQL_CONNECTION_STRING` |  | Store in Key Vault/app settings, not in code. |
| Global admin list | Cloudflare auth + email checks | `SAM_MINIGAMES_ADMIN_EMAILS` |  | Comma-separated lowercased emails. |
| Group admin records | `sam_mg_group_admins` table | SQL table `sam_mg_group_admins` |  | Preserve role model in new DB schema. |
| Client principal email header | n/a (provider-specific) | `x-ms-client-principal-name` |  | Fallback supported in `_auth.js`. |
| Environment name | Cloudflare Pages env | `AZURE_ENVIRONMENT` |  | Example: `staging` / `production`. |
| Monitoring key | Cloudflare analytics | `APPLICATIONINSIGHTS_CONNECTION_STRING` |  | Required before cutover. |
| CORS allow-list | Implicit same-origin | `CORS_ALLOWED_ORIGINS` |  | Explicit list for Azure API ingress. |

## DB entities to carry forward

- `sam_mg_players`
- `sam_mg_runs`
- `sam_mg_best`
- `sam_mg_groups`
- `sam_mg_group_admins`
- `sam_mg_group_games`

## Pre-cutover decision log

- Keep historical leaderboard data: [ ] yes [ ] no
- Keep same nickname rules: [ ] yes [ ] no
- Keep same game URLs: [ ] yes [ ] no
- Global+group admin enabled at launch: [ ] yes [ ] no

