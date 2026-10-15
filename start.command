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

# 1. Node.js present?
command -v node >/dev/null 2>&1 || fail "Node.js is not installed." "Download the LTS version from https://nodejs.org and run this again."

# 2. Node.js new enough?  Vite 7 needs 20.19+ or 22.12+
ver="$(node -p 'process.versions.node')"
major="${ver%%.*}"
minor="$(echo "$ver" | cut -d. -f2)"
ok=0
[ "$major" -ge 23 ] && ok=1
[ "$major" -eq 22 ] && [ "$minor" -ge 12 ] && ok=1
[ "$major" -eq 20 ] && [ "$minor" -ge 19 ] && ok=1
[ "$ok" -eq 1 ] || fail "Node v$ver is too old for this project." "It needs Node 20.19 or newer, or 22.12 or newer — get the LTS from https://nodejs.org"
echo "   [ok] Node v$ver"

# 3. Install packages on first run, and again whenever they change
if [ ! -f node_modules/.installed-lock ] || ! cmp -s package-lock.json node_modules/.installed-lock; then
  echo "   [..] Installing packages - first run takes a minute or two..."
  echo
  if ! npm ci --no-audit --no-fund; then
    echo
    echo "   [..] Clean install failed - trying a regular install instead..."
    npm install --no-audit --no-fund || fail "Could not install packages." "Check your internet connection and try again."
  fi
  cp package-lock.json node_modules/.installed-lock
  echo
fi
echo "   [ok] Packages ready"

# 4. Run it
echo
echo "   Starting the site - your browser will open by itself."
echo "   Keep this window open while you use it. Press Ctrl+C to stop."
echo
npm run dev -- --open
