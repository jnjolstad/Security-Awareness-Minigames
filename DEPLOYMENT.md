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

## Notes

- The published site must use this repository/workflow to serve new code.
- If the live page still shows old JavaScript after a successful run, do a hard refresh (`Ctrl+F5`) or append a cache-buster query.
- To verify the admin-panel build is live, check that the served leaderboard script contains `adminPanelV2`.

