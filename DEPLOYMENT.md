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

All auth/runtime variables are now centralized in:

- `Website/functions/_config.js`

This is the single config module used by both:
- `Website/functions/_auth.js`
- `Website/functions/security-awareness-month/minigames-api/[[path]].js`

Configure Pages Function environment variables:

- `SAM_MINIGAMES_ADMIN_EMAILS` (comma-separated global admin emails; with none set there is no global admin)
- `SAM_MINIGAMES_SESSION_SECRET` (random secret of at least 32 characters for signing admin sessions; required, with no fallback, so without it admin sign-in is off)
- `RESEND_API_KEY` (Resend API key used to send one-time admin login links)
- `SAM_MINIGAMES_EMAIL_FROM` (verified sender, e.g. `Security Awareness <security@njolstad.no>`)
- `SAM_MINIGAMES_ADMIN_LOGIN_TTL_MS` (optional; magic-link validity in ms, clamped to 1–60 minutes; default 900000)
- `SAM_MINIGAMES_PLAYER_LOGIN_TTL_MS` (optional; player sign-in link validity, same limits and default)
- `SAM_MINIGAMES_ADMIN_LOGIN_MAX_PER_HOUR` / `SAM_MINIGAMES_PLAYER_LOGIN_MAX_PER_HOUR` (optional; sign-in emails per address and requesting network per hour, 1 to 20; default 3)
- `SAM_MINIGAMES_LOGIN_COOLDOWN_MS` (optional; minimum gap between sign-in emails to one address from anyone, 10 s to 10 min; default 60000)
- `SAM_MINIGAMES_REGISTER_DUP_MAX_PER_HOUR` (optional; "email already registered" answers per network per hour before registration from it is blocked, 1 to 100; default 10)
- `SAM_MINIGAMES_ALLOW_KEY_LOGIN` (optional; `true` turns on the old email + admin-key login at `/auth/login`. Off by default. It skips the email step, so use it only as a way back in if email delivery is down. Needs `SAM_MINIGAMES_ADMIN_KEY` of 24+ characters.)

The admin page (`/admin`) now uses **email-only magic-link login**:

1. Admin enters email.
2. API sends one-time link by email (15 minute expiry, single-use).
3. Link verification creates an HttpOnly signed session cookie.

Global admins come from `SAM_MINIGAMES_ADMIN_EMAILS`; group admins added in the UI can also log in by email-only and are scoped to their group permissions.
When a global admin adds a group admin, the API now sends that group admin the same one-time login email automatically.

## Player sign-in by email

Players who registered with an email (groups that require full names, or the full-profile form) can sign back in from any browser or device:

1. On a game's start screen they choose **Already registered? Sign in** and enter their email.
2. If that email is registered, a one-time link to `/minigames/?player_login=...` is sent (same Resend setup as admin login).
3. Opening the link signs them in on that browser. Their scores and profile are unchanged.

Notes:
- The response is identical whether or not the email is registered, and the email is sent after the response, so neither the reply nor its timing says who has signed up.
- Limits: 10 requests per network per 10 minutes, 3 emails per address per network per hour, one email per address per cooldown, and 20 per address per hour overall. One visitor can't use up an address owner's allowance.
- Only a key hash is stored, so signing in issues a **new key**. Any browser that was signed in before has to sign in again.
- Nickname-only players have no email, so they can't use this.
- The new `sam_mg_player_login_tokens` table is created automatically on first request, and is also in `migrations/d1/minigames-schema.sql`.

## Group links

A group link is `?group=<slug>.<access code>`. The slug alone gives no access: reading a group's leaderboard, joining it and registering into it all need the code, and every failure looks the same (unknown slug, wrong code, inactive group). Repeated failures from one network are blocked for 10 minutes.

- Admins copy links from the admin page; they already include the code.
- **Rotate link code** (global admins) replaces the code and breaks every link already shared for that group.
- Groups that existed before access codes were added get a code automatically on the first request. **Their old links stop working, so share the new ones.**
- Players already in a group stay in it; they need the current link to see the group's leaderboard.

## Abuse protection

- Score checks: each click must be at least 250 ms after the previous one, the first at least 600 ms in, and a finished run needs 1 s per action overall. A script can still fabricate a plausible log, so keep an eye on the boards and remove suspicious players from the admin page.
- Registration, sign-in requests and group-code guesses are rate limited per network (IPv6 addresses are grouped by /64) using the `sam_mg_rate_limits` table.
- Write requests carrying an `Origin` header from another site are refused, and the admin session cookie is `SameSite=Strict`.
- `/admin/` is served with a CSP that forbids framing and inline scripts. All pages send `nosniff` and `no-referrer`.

For troubleshooting, use:

- `GET /security-awareness-month/minigames-api/auth/debug`

Signed out, it only returns `{"ok": true|false}`. Signed in as an admin it also lists which settings are missing or too short (never their values).

## Quick setup path (Cloudflare + GitHub)

1. Cloudflare Pages -> your project -> **Settings -> Builds & deployments -> Source**.
2. Connect source to `jnjolstad/SecurityAwarenessMonth` (`main`).
3. In Cloudflare Pages project settings, set:
   - **Framework preset**: None
   - **Build command**: *(empty)*
   - **Root directory**: `Website` (the name is case-sensitive, and `functions/` must be inside the root directory for the API to deploy)
   - **Build output directory**: *(empty)*
4. Trigger a new deployment in Cloudflare Pages for `main`.
5. (Optional) In GitHub repo settings, add the 3 secrets listed above if you want API-driven deploy from GitHub Actions too.
6. Add custom domain for this project:
   - `securityawarenessmonth.njolstad.no`
7. Verify the live admin script contains `admin-panel-v3`:
   - `https://securityawarenessmonth.njolstad.no/admin/admin.js`

If you want to keep `www.njolstad.no` for other content, do not attach `www` to this Pages project.

## Cloudflare Pages bindings and variables

Set these under the Pages project's **Settings -> Bindings** and **Variables and Secrets** (Production, and Preview if used). They are applied on the next deployment.

- D1 binding `AUKSJON_DB` (the leaderboard tables are prefixed `sam_mg_` and are created automatically)
- `SAM_MINIGAMES_ADMIN_EMAILS` (comma-separated global admins)
- `SAM_MINIGAMES_ADMIN_KEY` (secret, at least 24 characters)
- `SAM_MINIGAMES_SESSION_SECRET` (secret, different from the admin key)
- `RESEND_API_KEY` (secret) and `SAM_MINIGAMES_EMAIL_FROM` (a sender verified in Resend), used for admin login links

The admin page has a **Diagnostics** section that shows which of these are missing.

## Notes

- The published site must use this repository/workflow to serve new code.
- If the live page still shows old JavaScript after a successful run, do a hard refresh (`Ctrl+F5`) or append a cache-buster query.
- To verify the admin-panel build is live, check that the served `/admin/admin.js` contains `admin-panel-v3`.
