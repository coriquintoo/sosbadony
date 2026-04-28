#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8123}"

python3 -m http.server "$PORT" >/tmp/platformer-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT
sleep 1

curl -fsS "http://localhost:${PORT}/index.html" >/tmp/platformer-index.html
curl -fsS "http://localhost:${PORT}/src/main.js" >/tmp/platformer-main.js

rg -q 'phaser@3/dist/phaser.js' /tmp/platformer-index.html
rg -q 'src/main.js' /tmp/platformer-index.html
rg -q 'new Phaser.Game\(config\)' /tmp/platformer-main.js

echo "Smoke OK: static files served and Phaser bootstrap found."
