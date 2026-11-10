# Security Awareness Mini-games

Short browser games for Security Awareness Month. Each game is a scene with hidden openings an attacker would use. Players find them, then pick the answers that break the attack chain. Scores are re-checked on the server and feed a championship leaderboard, with optional private groups for teams and companies.

## What's in here

| Path | What it is |
| --- | --- |
| `Website/security-awareness-month/minigames/` | The games, hub and leaderboard (plain HTML, CSS and JavaScript, no build step) |
| `Website/admin/` | Admin page: groups, game selection, group admins, players |
| `Website/functions/` | Cloudflare Pages Functions: the API, sign-in and configuration |
| `Website/functions/security-awareness-month/minigames-api/` | Leaderboard API (`[[path]].js`) |
| `Website/functions/_auth.js`, `_config.js` | Admin sessions and all settings read from the environment |
| `Website/scripts/build-minigames-key.mjs` | Builds the server-side answer key from the game files |
| `migrations/d1/minigames-schema.sql` | Database schema (Cloudflare D1 / SQLite) |
| `.github/workflows/` | Deployment to Cloudflare Pages |

## How scoring works

The browser records every click with a timestamp. When a run finishes, the server replays the log against the answer key in `_minigames-key.js`, using its own clock, and decides the score. The browser never reports a score. After changing a game's answers, regenerate the key:

```
node Website/scripts/build-minigames-key.mjs
```

## Run it locally

Requires Node.js and [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

```
cd Website
wrangler pages dev . --port 8788 \
  --d1 AUKSJON_DB=minigames \
  --binding SAM_MINIGAMES_ADMIN_EMAILS=you@example.com \
  --binding SAM_MINIGAMES_SESSION_SECRET=<32+ random characters> \
  --binding RESEND_API_KEY=<key> \
  --binding SAM_MINIGAMES_EMAIL_FROM="Security Awareness <security@example.com>"
```

The games are at `http://localhost:8788/minigames/` and the admin page at `/admin/`. Tables are created on the first request.

## Deploy and configure

See [DEPLOYMENT.md](DEPLOYMENT.md) for Cloudflare Pages setup, every environment variable, sign-in, group links and the abuse protections.

## Games

Inbox, Overshare, Overshare 2, Desktop, Share settings, Real or fake, Weakest link, Front door, Night shift, On the road and Home office. The catalogue is in `Website/security-awareness-month/minigames/catalog.js`.

Openings are tagged with NSM's basic principles for ICT security where they fit. This is an independent project, not endorsed by NSM or NorSIS.
