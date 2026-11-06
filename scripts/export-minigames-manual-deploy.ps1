param(
  [string]$OutputZip = ".\manual-deploy-minigames.zip"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$required = @(
  "Website\security-awareness-month\minigames\leaderboard\leaderboard.js",
  "Website\security-awareness-month\minigames\board.js",
  "Website\functions\security-awareness-month\minigames-api\[[path]].js",
  "Website\functions\_auth.js"
)

foreach ($file in $required) {
  if (-not (Test-Path -LiteralPath $file)) {
    throw "Missing required file: $file"
  }
}

$leaderboard = Get-Content -LiteralPath "Website\security-awareness-month\minigames\leaderboard\leaderboard.js" -Raw
if ($leaderboard -notmatch "adminPanelV2") {
  throw "leaderboard.js does not contain adminPanelV2. Refusing to package."
}

$staging = Join-Path $env:TEMP ("sam-manual-deploy-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $staging | Out-Null

try {
  Copy-Item -Recurse -Force -Path "Website\*" -Destination $staging
  if (Test-Path -LiteralPath $OutputZip) {
    Remove-Item -LiteralPath $OutputZip -Force
  }
  Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $OutputZip -Force
  Write-Host "Created package: $OutputZip" -ForegroundColor Green
  Write-Host "Contains updated admin panel files (adminPanelV2)." -ForegroundColor Green
} finally {
  if (Test-Path -LiteralPath $staging) {
    Remove-Item -LiteralPath $staging -Recurse -Force
  }
}

