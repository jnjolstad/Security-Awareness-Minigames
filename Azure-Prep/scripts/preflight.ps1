param()

$ErrorActionPreference = "Stop"

Write-Host "Azure prep preflight (read-only)" -ForegroundColor Cyan
Write-Host "Working directory: $PWD"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $repoRoot

$requiredFiles = @(
  "Website\security-awareness-month\minigames\catalog.js",
  "Website\security-awareness-month\minigames\board.js",
  "Website\security-awareness-month\minigames\leaderboard\leaderboard.js",
  "Website\functions\security-awareness-month\minigames-api\[[path]].js",
  "Website\functions\security-awareness-month\_minigames-key.js",
  "Website\functions\_auth.js",
  "Azure-Prep\01-preflight-checklist.md",
  "Azure-Prep\02-config-matrix.md"
)

$missing = @()
foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath $file)) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "Missing required files:" -ForegroundColor Red
  $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host ""
Write-Host "All required files are present." -ForegroundColor Green

$apiFile = "Website\functions\security-awareness-month\minigames-api\[[path]].js"
$apiContent = Get-Content -LiteralPath $apiFile -Raw
$checks = @(
  @{ Name = "groups endpoint"; Pattern = "/groups" },
  @{ Name = "group admins endpoint"; Pattern = "/groups/admin" },
  @{ Name = "group games endpoint"; Pattern = "/groups/games" },
  @{ Name = "admin endpoint"; Pattern = "/admin" },
  @{ Name = "groups table"; Pattern = "sam_mg_groups" }
)

$failedChecks = @()
foreach ($check in $checks) {
  if ($apiContent -notmatch [regex]::Escape($check.Pattern)) {
    $failedChecks += $check.Name
  }
}

if ($failedChecks.Count -gt 0) {
  Write-Host ""
  Write-Host "API checks failed:" -ForegroundColor Red
  $failedChecks | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "API group/admin checks passed." -ForegroundColor Green

$boardFile = "Website\security-awareness-month\minigames\leaderboard\leaderboard.js"
$boardContent = Get-Content -LiteralPath $boardFile -Raw
if ($boardContent -notmatch "adminPanelV2") {
  Write-Host "Leaderboard admin panel marker not found (adminPanelV2)." -ForegroundColor Red
  exit 1
}

Write-Host "Leaderboard admin panel check passed." -ForegroundColor Green

Write-Host ""
Write-Host "Preflight complete. No infrastructure changes were made." -ForegroundColor Cyan
exit 0
