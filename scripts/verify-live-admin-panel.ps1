param(
  [string]$Url = "https://securityawarenessmonth.njolstad.no/admin/admin.js",
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = "Stop"

Write-Host "Checking live admin script..." -ForegroundColor Cyan
Write-Host "URL: $Url"

try {
  $res = Invoke-WebRequest -Uri ($Url + "?v=" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -TimeoutSec $TimeoutSec
} catch {
  Write-Host "NOT READY: domain is not reachable yet (DNS/Cloudflare mapping pending)." -ForegroundColor Yellow
  Write-Host $_.Exception.Message -ForegroundColor Yellow
  exit 3
}
$content = [string]$res.Content

$hasMarker = $content.Contains("build-marker: admin-panel-v3-2026-11-06")

if ($hasMarker) {
  Write-Host "OK: Live site has the new admin panel build." -ForegroundColor Green
  exit 0
}

Write-Host "NOT READY: Live site is still serving old script." -ForegroundColor Yellow
if (-not $hasMarker) { Write-Host "- Missing build-marker: admin-panel-v3-2026-11-06." -ForegroundColor Yellow }
exit 2
