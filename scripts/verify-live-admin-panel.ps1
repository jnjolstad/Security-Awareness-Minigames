param(
  [string]$Url = "https://www.njolstad.no/security-awareness-month/minigames/leaderboard/leaderboard.js",
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = "Stop"

Write-Host "Checking live leaderboard script..." -ForegroundColor Cyan
Write-Host "URL: $Url"

$res = Invoke-WebRequest -Uri ($Url + "?v=" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -TimeoutSec $TimeoutSec
$content = [string]$res.Content

$hasAdminPanel = $content.Contains("adminPanelV2")
$hasMarker = $content.Contains("build-marker: admin-panel-v2-2026-11-06")

if ($hasAdminPanel -and $hasMarker) {
  Write-Host "OK: Live site has the new admin panel build." -ForegroundColor Green
  exit 0
}

Write-Host "NOT READY: Live site is still serving old script." -ForegroundColor Yellow
if (-not $hasAdminPanel) { Write-Host "- Missing adminPanelV2 marker." -ForegroundColor Yellow }
if (-not $hasMarker) { Write-Host "- Missing build-marker: admin-panel-v2-2026-11-06." -ForegroundColor Yellow }
exit 2

