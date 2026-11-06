#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ONLINE_TERMINAL_URL="https://www.njolstad.no/security-awareness-month-escape-room/terminal/"
HOST_TOOLS_URL="https://www.njolstad.no/security-awareness-month-escape-room/tools"
HOST_HELPER_URL="https://www.njolstad.no/security-awareness-month-escape-room/terminal/remote.html"
OFFLINE_TERMINAL="$SCRIPT_DIR/NIMBUS-Secure-Terminal/index.html"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/breach-protocol"
SETTINGS_FILE="$STATE_DIR/desktop-settings.tsv"
PROFILE_DIR=""
SETTINGS_SAVED=0

log() {
  printf '[BREACH PROTOCOL] %s\n' "$*"
}

fail() {
  printf '[BREACH PROTOCOL] ERROR: %s\n' "$*" >&2
  exit 1
}

find_browser() {
  local candidate
  for candidate in google-chrome-stable google-chrome chromium-browser chromium; do
    if command -v "$candidate" >/dev/null 2>&1; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

remember_and_set() {
  local schema="$1"
  local key="$2"
  local value="$3"
  local current

  command -v gsettings >/dev/null 2>&1 || return 0
  gsettings list-keys "$schema" 2>/dev/null | grep -Fxq "$key" || return 0
  current="$(gsettings get "$schema" "$key")"
  printf '%s\t%s\t%s\n' "$schema" "$key" "$current" >> "$SETTINGS_FILE"
  gsettings set "$schema" "$key" "$value"
  SETTINGS_SAVED=1
}

prepare_desktop() {
  mkdir -p "$STATE_DIR"
  : > "$SETTINGS_FILE"

  if command -v gsettings >/dev/null 2>&1; then
    remember_and_set org.gnome.desktop.session idle-delay "uint32 0"
    remember_and_set org.gnome.desktop.screensaver lock-enabled "false"
    remember_and_set org.gnome.desktop.notifications show-banners "false"
    remember_and_set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type "'nothing'"
    log "Screen locking, idle sleep, and notification banners are disabled while the room runs."
  else
    log "GNOME settings were not found. Disable screen lock, sleep, and notifications manually."
  fi
}

restore_desktop() {
  local schema
  local key
  local value

  if (( SETTINGS_SAVED )) && [[ -f "$SETTINGS_FILE" ]]; then
    while IFS=$'\t' read -r schema key value; do
      [[ -n "$schema" ]] || continue
      gsettings set "$schema" "$key" "$value" >/dev/null
    done < "$SETTINGS_FILE"
    log "Previous Ubuntu desktop settings restored."
  fi

  if [[ -n "$PROFILE_DIR" && -d "$PROFILE_DIR" ]]; then
    rm -rf -- "$PROFILE_DIR"
  fi
  rm -f -- "$SETTINGS_FILE"
}

main() {
  local browser
  local terminal_uri
  local mode="online"

  if [[ "${1:-}" == "--offline" ]]; then
    mode="offline"
    [[ -f "$OFFLINE_TERMINAL" ]] || fail "Cannot find $OFFLINE_TERMINAL."
    terminal_uri="file://$OFFLINE_TERMINAL"
  elif [[ $# -gt 0 ]]; then
    fail "Unknown option: $1. Use --offline only for the emergency local fallback."
  else
    terminal_uri="$ONLINE_TERMINAL_URL"
  fi

  browser="$(find_browser)" || fail "Install Google Chrome or Chromium, then run this script again."

  prepare_desktop
  trap restore_desktop EXIT INT TERM

  PROFILE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/breach-protocol-browser.XXXXXX")"
  log "Browser: $browser"
  if [[ "$mode" == "online" ]]; then
    log "Online terminal: $ONLINE_TERMINAL_URL"
    log "Host tools: $HOST_TOOLS_URL"
    log "Host Helper: $HOST_HELPER_URL"
    log "The player terminal needs no site login. Sign in as the owner only on the Host Helper tablet."
  else
    log "OFFLINE FALLBACK: Host Helper synchronization is unavailable."
  fi
  log "Starting the NIMBUS terminal in kiosk mode."
  log "Press Alt+F4 to exit; your previous Ubuntu settings will then be restored."

  "$browser" \
    --kiosk \
    --no-first-run \
    --no-default-browser-check \
    --disable-session-crashed-bubble \
    --disable-features=Translate \
    --password-store=basic \
    --user-data-dir="$PROFILE_DIR" \
    "$terminal_uri"
}

main "$@"
