# Azure prep package (no cutover)

This folder prepares the mini-games for Azure **without moving traffic** and without changing the current Cloudflare production setup.

## What this includes

- `01-preflight-checklist.md`  
  Concrete readiness checklist before any migration work starts.
- `02-config-matrix.md`  
  Source-to-target mapping for runtime/config values.
- `scripts/preflight.ps1`  
  Safe local checks (read-only) to confirm required files/endpoints exist.

## What this does *not* do

- No DNS changes
- No deployment changes
- No data migration
- No Cloudflare teardown

## Suggested use

1. Complete checklist items in `01-preflight-checklist.md`.
2. Fill target values in `02-config-matrix.md`.
3. Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\Azure-Prep\scripts\preflight.ps1
```

4. Share results internally for go/no-go.

