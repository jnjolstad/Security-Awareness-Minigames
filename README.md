# Security Awareness Minigames

This repository contains only the Security Awareness Month minigames stack.

## Included

- Frontend minigames: `Website/security-awareness-month/minigames/`
- Admin UI: `Website/admin/`
- API/backend (Cloudflare Pages Functions): `Website/functions/security-awareness-month/minigames-api/[[path]].js`
- Shared auth/config functions:
  - `Website/functions/_auth.js`
  - `Website/functions/_config.js`
- Database schema migration:
  - `migrations/d1/minigames-schema.sql`

## Deployment

- Cloudflare Pages deploy config:
  - `.github/workflows/deploy-cloudflare-pages.yml`
- Deployment notes:
  - `DEPLOYMENT.md`
  - `DOMAIN-SETUP.md`
