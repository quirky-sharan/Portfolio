#!/usr/bin/env bash
# macOS: double-click this file in Finder.  Linux: run `bash start.command`.
set -uo pipefail
cd "$(dirname "$0")" || exit 1

echo
echo "   SHARAN SONI  -  PORTFOLIO"
echo "   -------------------------"
echo

fail() {
  echo "   [x] $1"
  [ -n "${2:-}" ] && echo "       $2"
  echo
  read -r -p "   Press Enter to close..." _ || true
  exit 1
}

# 0. Opened on its own, without the rest of the project?
[ -f package.json ] || fail "This file was opened on its own, without the rest of the project." "Unzip the whole download first, then run start.command from inside the extracted folder."

# 1. Node.js present?
command -v node >/dev/null 2>&1 || fail "Node.js is not installed." "Download the LTS version from https://nodejs.org and run this again."

# 2. Node.js new enough?  This project needs 22.12 or newer
ver="$(node -p 'process.versions.node')"
major="${ver%%.*}"
minor="$(echo "$ver" | cut -d. -f2)"
ok=0
[ "$major" -ge 23 ] && ok=1
[ "$major" -eq 22 ] && [ "$minor" -ge 12 ] && ok=1
[ "$ok" -eq 1 ] || fail "Node v$ver is too old for this project." "It needs Node 22.12 or newer — get the LTS from https://nodejs.org"
echo "   [ok] Node v$ver"

# 3. Install packages on first run, and again whenever they change
#    (or when node_modules came from a different OS / CPU)
plat="$(node -p "process.platform+'-'+process.arch")"
if [ ! -f node_modules/.installed-lock ] || ! cmp -s package-lock.json node_modules/.installed-lock \
  || [ "$(cat node_modules/.installed-platform 2>/dev/null)" != "$plat" ]; then
  echo "   [..] Installing packages - first run takes a minute or two..."
  echo
  # forget the old install first, so a cancelled install is redone next time
  rm -f node_modules/.installed-lock node_modules/.installed-platform
  if ! npm ci --no-audit --no-fund; then
    echo
    echo "   [..] Clean install failed - trying a regular install instead..."
    npm install --no-audit --no-fund || fail "Could not install packages." "Check your internet connection and try again."
  fi
  cp package-lock.json node_modules/.installed-lock
  echo "$plat" > node_modules/.installed-platform
  echo
fi
echo "   [ok] Packages ready"

# 4. Run it
echo
echo "   Starting the site - your browser will open by itself."
echo "   Keep this window open while you use it. Press Ctrl+C to stop."
echo
npm run dev -- --open
