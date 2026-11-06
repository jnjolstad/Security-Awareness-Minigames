# BREACH PROTOCOL: plan for moving to the company ecosystem

**Goal:** move the escape room from Joar's private setup (njolstad.no, a private Cloudflare account, a private GitHub repository and private Resend e-mail) to infrastructure the company owns and operates.

**Assumption:** the company runs on Microsoft 365, Entra ID and Azure. If it is actually Cloudflare, AWS or GCP, phases 0, 1 and 5 stay the same and only the hosting part in phases 2–4 changes. Option B below shows the Cloudflare path.

---

## 1. What exists today (inventory)

| Part | Today | Where in the code |
|---|---|---|
| Public website: signup form, schedule, play page | Static HTML on Cloudflare Pages, www.njolstad.no | `security-awareness-month-escape-room/*.html` |
| Digital game (the terminal) | Static HTML, CSS and JS: login, MFA, mail, files, network, assistant, office, kill switch | `security-awareness-month-escape-room/terminal/` |
| Backend API (about 12 endpoints) | Cloudflare Pages Functions (JavaScript) | `functions/security-awareness-month-escape-room/` |
| Database | Cloudflare KV (`HOTWHEELS_KV`), shared with other private apps | Keys `escape-room-*` |
| Admin login | Private user database plus session cookie, admin by e-mail list | `functions/_auth.js`, `functions/_middleware.js` |
| E-mail | Resend API, sending from noreply@njolstad.no | `api/register.js`, `api/admin-registrations.js` |
| Source code | Private GitHub repository `jnjolstad/njolstad-apps`, mixed in with other private apps | Monorepo |
| Physical room | Laptop(s) running the terminal, props, printouts, 3D-printed figures, host guides | `Phase-1` … `Phase-5` folders |
| Promotion | Intranet post (EN/NO), poster, QR code, PowerPoint slide | `Promotion/` |

**Data in KV (all prefixed `escape-room-`):**
- `registration:<uuid>`: teams, captain, e-mail, members, time slot and result.
- `run:<uuid>`: digital runs. `demo-run:<token>`: demo runs, kept 6 hours.
- `code:<CODE>` and `ref:<REF>`: team codes and code lookup cache.
- `slots`, `blocked-dates` and `booking:<slot>`: the schedule.
- `setting:*` (demo on/off, run limits), `active-runs`, `starts:<date>`, plus the physical room clock state.

**Personal data:** team captain name and e-mail, team member names, results. These are kept for 180 days today.

---

## 2. Choice of target platform

### Option A: Microsoft and Azure (recommended if the company is a Microsoft shop)

| Today | Azure equivalent |
|---|---|
| Cloudflare Pages (static) | **Azure Static Web Apps** (the free tier is enough) |
| Pages Functions | **Azure Functions** (managed functions inside Static Web Apps) |
| Cloudflare KV | **Azure Table Storage** (cheapest, key/value, a near 1:1 match) or Cosmos DB serverless |
| Private login and admin list | **Entra ID (SSO)**: built-in auth in Static Web Apps, admin via an Entra group, e.g. `SG-EscapeRoom-Hosts` |
| Resend e-mail | **Microsoft Graph `sendMail`** from a shared mailbox, e.g. securityawareness@company, or Azure Communication Services Email |
| njolstad.no | A company subdomain, e.g. `escaperoom.company.com`, or an internal URL |
| GitHub (private) | The company's GitHub or Azure DevOps, with a CI/CD pipeline |

**Advantages:**
- Employees log in with their company account, so no team codes or approval are needed for digital play.
- Everything sits inside the company's existing security and compliance controls.

**Disadvantage:**
- The backend has to be ported: about 12 small functions. The KV calls are wrapped in a few places (`_runs.js`, `_slots.js`, `_room-state.js`), so this is manageable.

### Option B: the company's own Cloudflare account (fastest)

- Copy the code into a separate repository and create a new Pages project plus a dedicated KV namespace on the company account.
- Point a company subdomain at it.
- Swap the login for Cloudflare Access with Entra ID as the identity provider.
- Swap Resend for the company's own sender domain.
- **Effort:** 2–4 days. Almost no code changes.

---

## 3. Phased plan

### Phase 0: Approval and ownership (start now, often the slowest part)
- [ ] Appoint a **business owner** (Security / HR / Communications) and a **technical owner** (IT).
- [ ] Choose a platform (option A or B) together with IT.
- [ ] Security review of the app (OWASP basics, the admin API, rate limiting).
- [ ] **Privacy:**
  - Run a DPIA light, or confirm one is not needed.
  - Add a privacy notice on the signup form and decide the legal basis (legitimate interest / training).
  - Shorten retention to 30–90 days after the campaign.
- [ ] Order a domain or subdomain, a sender mailbox and an Entra group for hosts.

### Phase 1: Separate the code (1–2 days)
- [ ] Create a dedicated repository (in the company GitHub or Azure DevOps) with **only** the escape room. Bring the history if that is useful.
  - Include `security-awareness-month-escape-room/**`, `functions/security-awareness-month-escape-room/**` and the escape-room parts of `functions/_middleware.js`.
  - Do **not** copy the private `_auth.js`, other apps, or `HOTWHEELS_KV` naming.
- [ ] Rename `HOTWHEELS_KV` to `ESCAPE_ROOM_KV`. Remove hard-coded references to `njolstad.no` and `noreply@njolstad.no` and turn them into configuration.
- [ ] Gather all configuration in one place: `ESCAPE_ROOM_REGISTRATION_EMAIL`, sender address, admin group, base URL.
- [ ] Add a README, an architecture diagram and a runbook (operations, reset, support).

### Phase 2: Infrastructure (option A: 3–5 days, option B: 1 day)
- [ ] Create resources with infrastructure as code (Bicep/Terraform) in the company subscription or account:
  - **A:** Static Web App, Storage Account (Table), Key Vault for secrets, Application Insights.
  - **B:** Pages project, KV namespace, Cloudflare Access application.
- [ ] Set up CI/CD: deploy from `main`, previews for PRs.
- [ ] Separate **test** and **production** environments.

### Phase 3: Port the backend (option A only, about 1 week)
- [ ] Create a small storage layer (`storage.get/put/delete/list`) and implement it on Table Storage. Point `_runs.js`, `_slots.js` and `_room-state.js` at it.
- [ ] Rewrite each endpoint from `onRequestGet/Post({request, env})` to Azure Functions (`app.http(...)`). The logic itself stays the same.
- [ ] Login: drop the private session cookie and use Static Web Apps auth (`/.auth/me`) with Entra ID. Admin role via the Entra group (`staticwebapp.config.json` → `allowedRoles`).
- [ ] E-mail: swap Resend for Microsoft Graph `sendMail` (app registration with `Mail.Send` limited to one mailbox through an application access policy).
- [ ] Optional, but recommended at the same time:
  - Signup and digital play behind SSO, so no team codes are needed.
  - Check answers on the server.

### Phase 4: Migrate data and switch over (1 day)
- [ ] Decide whether to bring the data across. Results and the leaderboard for the current campaign should be. Old registrations can be left behind.
- [ ] Export from KV with `wrangler kv key list` / `get` into JSON, then import into Table Storage with a script. Use the same keys, so it maps 1:1.
- [ ] Freeze the old version: show a "We have moved" message on njolstad.no and redirect (301) to the new URL.
- [ ] Update the QR code, intranet post, poster and PowerPoint with the new URL. Promotion files are in `Promotion/`; the QR code is generated from the URL.
- [ ] Smoke test: register, approve, e-mail, digital run with a hint, host panel, demo, physical room clock.

### Phase 5: Operations and handover
- [ ] Monitoring: Application Insights or Cloudflare Analytics, with an alert on 5xx errors and slow responses.
- [ ] Support: a contact person or Teams channel, and an FAQ page.
- [ ] Physical room:
  - Hand over the props, the 3D files (Phase-4) and the host guides (Phase-5) to the business owner.
  - Have IT set up the laptop(s) as company devices (kiosk mode / locked browser, see `run-play-locked.py`).
- [ ] Clean up afterwards:
  - Delete the escape-room data from Joar's private KV.
  - Turn off the Resend sender.
  - Archive the private copy of the code.

---

## 4. Effort and cost (estimate)

| | Option A (Azure + Entra ID) | Option B (company Cloudflare) |
|---|---|---|
| Development | approx. 2–3 weeks | approx. 2–4 days |
| Running cost at today's scale | ~0–10 USD/month (SWA Free, Table Storage costs cents, Graph mail is free) | 0 USD (Free) to 5 USD/month (Workers Paid) |
| Login | Company account (SSO) | Company account via Cloudflare Access (free up to 50 users, beyond that paid per user) |
| Fit with the company's existing controls | Best | Good |

**Note:** Cloudflare Access is billed per user above 50 users. With many employees, option A is usually cheaper and more natural for login.

---

## 5. Risks and things to remember

- **Lead time on approvals** (IT, security, privacy) is usually longer than the development itself, so start phase 0 now.
- **Email deliverability:** the new sender must have SPF/DKIM/DMARC set up in the company domain, or confirmation e-mails will end up in spam.
- **Answers leaking between teams:** everyone currently has the same solution. Before a large rollout, consider variants per team.
- **The physical room** depends on laptops having internet access to the room-state API. On the company network, check the proxy and firewall rules for the new URL.
- **Two parallel versions:** avoid running both the old and the new at the same time with different data. Switch over in one step (phase 4).
- **Ownership after the campaign:** decide who maintains the code and who may change content (puzzles, texts).

---

## 6. Decisions needed from the company

1. Platform: Azure (A) or the company's Cloudflare account (B)?
2. URL: internal only, or reachable from outside (for remote employees without VPN)?
3. Login: company account (SSO) for everyone, or keep team codes?
4. Sender mailbox for confirmations?
5. Privacy: retention period, and who owns the data?
6. Who are the business owner and the technical owner after handover?
