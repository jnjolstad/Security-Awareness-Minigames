# Deployment (new repo -> Cloudflare Pages)

This repo now includes an automatic deployment workflow:

- Workflow: `.github/workflows/deploy-cloudflare-pages.yml`
- Trigger: push to `main` when files under `Website/` change
- Deploy command: `wrangler pages deploy Website --project-name=<project>`

## Required GitHub secrets

Configure these repository secrets in `jnjolstad/SecurityAwarenessMonth`:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT`

The workflow now validates these up-front and fails with explicit errors if any are missing.

## Admin security configuration (required for admin panel)

Configure Pages Function environment variables:

- `SAM_MINIGAMES_ADMIN_EMAILS` (comma-separated allowed admin emails)
- `SAM_MINIGAMES_ADMIN_KEY` (strong random secret used as admin API key)
- `SAM_MINIGAMES_SESSION_SECRET` (strong random secret for signing admin session cookies)

The admin page (`/admin`) now uses admin email + API key login to create an HttpOnly signed session cookie; browser-set identity cookies are not used for admin authentication.

## Quick setup path (Cloudflare + GitHub)

1. Cloudflare Pages -> your project -> **Settings -> Builds & deployments -> Source**.
2. Connect source to `jnjolstad/SecurityAwarenessMonth` (`main`).
3. In Cloudflare Pages project settings, set:
   - **Framework preset**: None
   - **Build command**: *(empty)*
   - **Build output directory**: `Website`
4. Trigger a new deployment in Cloudflare Pages for `main`.
5. (Optional) In GitHub repo settings, add the 3 secrets listed above if you want API-driven deploy from GitHub Actions too.
6. Add custom domain for this project:
   - `securityawarenessmonth.njolstad.no`
7. Verify live script contains `adminPanelV2`:
   - `https://securityawarenessmonth.njolstad.no/security-awareness-month/minigames/leaderboard/leaderboard.js`

If you want to keep `www.njolstad.no` for other content, do not attach `www` to this Pages project.

## Notes

- The published site must use this repository/workflow to serve new code.
- If the live page still shows old JavaScript after a successful run, do a hard refresh (`Ctrl+F5`) or append a cache-buster query.
- To verify the admin-panel build is live, check that the served leaderboard script contains `adminPanelV2`.
