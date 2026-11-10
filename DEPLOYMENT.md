# Deployment and configuration

The site is static files plus Cloudflare Pages Functions, with a Cloudflare D1 database for scores and groups. It is published from the `Website/` directory.

## Cloudflare Pages

1. In Cloudflare, create a Pages project and connect it to this repository (`main`).
2. Build settings:
   - **Framework preset**: None
   - **Build command**: empty
   - **Root directory**: `Website`. The name is case-sensitive, and `functions/` must be inside the root directory for the API to deploy.
   - **Build output directory**: empty
3. Under **Settings -> Bindings**, add a D1 binding named `AUKSJON_DB`. The tables are prefixed `sam_mg_` and are created on the first request. The schema is also in `migrations/d1/minigames-schema.sql`.
4. Under **Settings -> Variables and Secrets**, add the variables below (Production, and Preview if used). They apply on the next deployment.
5. Under **Custom domains**, add your domain.

### Deploying from GitHub Actions

`.github/workflows/deploy-cloudflare-pages.yml` runs `wrangler pages deploy Website` on pushes to `main` that touch `Website/`. It needs these repository secrets and skips the deploy, with a notice, when any is missing. That is fine if Pages is connected to the repository directly.

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT`

## Environment variables

All of them are read in one place, `Website/functions/_config.js`.

**Required**

| Variable | Purpose |
| --- | --- |
| `SAM_MINIGAMES_ADMIN_EMAILS` | Comma-separated global admin emails. With none set there is no global admin. |
| `SAM_MINIGAMES_SESSION_SECRET` | Random secret of at least 32 characters that signs admin sessions. There is no fallback, so without it admin sign-in is off. |
| `RESEND_API_KEY` | Resend API key used to send sign-in links. |
| `SAM_MINIGAMES_EMAIL_FROM` | Sender verified in Resend, for example `Security Awareness <security@example.com>`. |

**Optional**

| Variable | Default | Purpose |
| --- | --- | --- |
| `SAM_MINIGAMES_ADMIN_LOGIN_TTL_MS` | 900000 | Admin sign-in link lifetime. Clamped to 1 to 60 minutes. |
| `SAM_MINIGAMES_PLAYER_LOGIN_TTL_MS` | 900000 | Player sign-in link lifetime, same limits. |
| `SAM_MINIGAMES_ADMIN_LOGIN_MAX_PER_HOUR`, `SAM_MINIGAMES_PLAYER_LOGIN_MAX_PER_HOUR` | 3 | Sign-in emails per address and requesting network per hour (1 to 20). |
| `SAM_MINIGAMES_LOGIN_COOLDOWN_MS` | 60000 | Minimum gap between sign-in emails to one address, from anyone (10 s to 10 min). |
| `SAM_MINIGAMES_REGISTER_DUP_MAX_PER_HOUR` | 10 | "Email already registered" answers per network per hour before registration from it is blocked (1 to 100). |
| `SAM_MINIGAMES_ALLOW_KEY_LOGIN` | off | `true` enables email + admin key login at `/auth/login`. It skips the email step, so use it only as a way back in if email delivery is down. Needs `SAM_MINIGAMES_ADMIN_KEY` of 24+ characters. |

## Admin sign-in

The admin page (`/admin/`) signs in with a one-time link sent by email:

1. The admin enters their email.
2. The API emails a single-use link, valid for 15 minutes by default.
3. Opening it creates an HttpOnly, `SameSite=Strict` signed session.

Global admins come from `SAM_MINIGAMES_ADMIN_EMAILS`. Group admins are added in the admin page by a global admin, receive the same sign-in email straight away, and can only manage their own group.

## Player sign-in

Players who registered with an email (groups that require full names, or the full-profile form) can sign back in from any browser or device:

1. On a game's start screen they choose **Already registered? Sign in** and enter their email.
2. If that email is registered, a one-time link to `/minigames/?player_login=...` is sent.
3. Opening it signs them in on that browser. Scores and profile are unchanged.

Notes:

- The response is identical whether or not the email is registered, and the email is sent after the response, so neither the reply nor its timing says who has signed up.
- Limits: 10 requests per network per 10 minutes, 3 emails per address per network per hour, one email per address per cooldown, and 20 per address per hour overall. One visitor can't use up an address owner's allowance.
- Only a key hash is stored, so signing in issues a new key. Any browser that was signed in before has to sign in again.
- Nickname-only players have no email, so they can't use this.

## Group links

A group link is `?group=<slug>.<access code>`. The slug alone gives no access: reading a group's leaderboard, joining it and registering into it all need the code. Every failure looks the same (unknown slug, wrong code, inactive group), and repeated failures from one network are blocked for 10 minutes.

- Admins copy links from the admin page; they already include the code.
- **Rotate link code** (global admins) replaces the code and breaks every link already shared for that group.
- Groups created before access codes existed get a code automatically on the first request, so their earlier links must be re-shared.
- Players already in a group stay in it. They need the current link to see the group's leaderboard.

## Abuse protection

- Score checks: each click must be at least 250 ms after the previous one, the first at least 600 ms in, and a finished run needs 1 s per action overall. A script can still fabricate a plausible log, so keep an eye on the boards and remove suspicious players from the admin page.
- Registration, sign-in requests and group-code guesses are rate limited per network (IPv6 addresses are grouped by /64) using the `sam_mg_rate_limits` table.
- Write requests carrying an `Origin` header from another site are refused.
- `/admin/` is served with a CSP that forbids framing and inline scripts. All pages send `nosniff` and `no-referrer`.

## Troubleshooting

`GET /security-awareness-month/minigames-api/auth/debug` returns only `{"ok": true|false}` when signed out. Signed in as an admin it also lists which settings are missing or too short, never their values. The admin page has a **Diagnostics** section with the same information.

If a page still shows old JavaScript after a deploy, hard refresh (`Ctrl+F5`).
