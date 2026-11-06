# Domain setup: `securityawarenessmonth.njolstad.no`

Use this when keeping `www.njolstad.no` for other pages and running Security Awareness Month on a separate subdomain.

## 1) Domene.no (create subdomain)

In Domene.no control panel:

1. Open **Subdomene**
2. Create subdomain: `securityawarenessmonth`
3. Save

This creates `securityawarenessmonth.njolstad.no`.

## 2) Cloudflare DNS (point subdomain to Pages)

In Cloudflare (zone: `njolstad.no`) -> **DNS**:

- Add record:
  - Type: `CNAME`
  - Name: `securityawarenessmonth`
  - Target: `<your-pages-project>.pages.dev` (example: `securityawarenessmonth.pages.dev`)
  - Proxy status: **Proxied** (orange cloud)

## 3) Cloudflare Pages (bind custom domain)

In Pages project (`securityawarenessmonth`) -> **Custom domains**:

1. Add: `securityawarenessmonth.njolstad.no`
2. Wait until status is **Active**

## 4) Build/deploy settings (Pages project)

Project -> **Settings** -> **Builds & deployments**:

- Framework preset: `None`
- Build command: *(empty)*
- Build output directory: `Website`
- Production branch: `main`

Deploy latest commit after saving.

## 5) Verify live admin-panel build

Check file directly:

- `https://securityawarenessmonth.njolstad.no/admin/admin.js`

It must contain:

- `build-marker: admin-panel-v3-2026-11-06`

You can also run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-live-admin-panel.ps1
```

