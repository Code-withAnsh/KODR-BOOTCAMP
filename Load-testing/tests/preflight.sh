#!/usr/bin/env bash
# Event pre-flight checklist (spec section 11), run ON THE BOX from ~/flash-sale.
#   bash tests/preflight.sh          -> quick checks
#   bash tests/preflight.sh --full   -> also functional, event tests (last unit, double-click) and crash test
set -u
cd "$(dirname "$0")/.." || exit 2
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ok   $1"; }
fail() { FAIL=$((FAIL+1)); echo "  FAIL $1 -> $2"; }

echo "[1] listening on 0.0.0.0:8080"
l=$(sudo ss -tlnp | grep -E '(0\.0\.0\.0|\*):8080 ' || true)
[ -n "$l" ] && ok "ss shows 0.0.0.0:8080" || fail "port 8080" "not on 0.0.0.0"

echo "[2] /health"
h=$(curl -s -m 5 localhost:8080/health)
[ "$h" = '{"status":"ok"}' ] && ok "health = $h" || fail "health" "$h"

echo "[3] database and cache on this machine (no cloud URLs)"
if grep -rniE 'mongodb\+srv|atlas|mongodb\.net|amazonaws\.com|redislabs|upstash|supabase|firebase' app/src docker-compose.yml .env 2>/dev/null; then
  fail "cloud URL" "found (see above)"
else ok "no cloud database/cache URL in app/src, docker-compose.yml, .env"; fi
grep -q '^MONGO_URL=mongodb://mongo:27017' .env && ok "MONGO_URL points at the local mongo container" || fail "MONGO_URL" "$(grep MONGO_URL .env)"

echo "[4] restarts on its own, no internet needed"
for s in app mongo; do
  id=$(docker compose ps -q $s)
  pol=$(docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' "$id" 2>/dev/null)
  [ "$pol" = "unless-stopped" ] && ok "$s restart policy unless-stopped" || fail "$s restart policy" "$pol"
done
[ "$(systemctl is-enabled docker)" = "enabled" ] && ok "docker starts at boot" || fail "docker at boot" "not enabled"
for img in mongo:7 flash-sale-app:latest; do
  docker image inspect "$img" >/dev/null 2>&1 && ok "image $img is on the box" || fail "image $img" "missing (would need internet)"
done
grep -qE 'npm (install|i)|git pull' app/src/server.js && fail "startup" "network call at startup" || ok "no npm install / git pull at startup (only at build time)"

echo "[5] no dev tools"
if grep -rniE 'nodemon|--reload|--watch|morgan' app/Dockerfile app/package.json docker-compose.yml app/src 2>/dev/null; then
  fail "dev tools" "found (see above)"
else ok "no nodemon / --reload / --watch / request logger"; fi
if grep -rniE 'rate-?limit|express-rate-limit' app/src app/package.json 2>/dev/null; then fail "rate limiting" "found"; else ok "no rate limiting"; fi

if [ "${1:-}" = "--full" ]; then
  echo "[6] functional (every endpoint, every error code)"
  docker run --rm --network host -v "$PWD/tests:/t:ro" node:20-alpine node /t/functional.js 2>&1 | grep -E "FAIL|RESULT" | sed 's/^/  /'
  echo "[7] test 1 last unit + test 2 double-click (spec commands, 3 runs)"
  bash tests/event_checks.sh 3 2>&1 | grep -E "FAIL|RESULT" | sed 's/^/  /'
  echo "[8] test 3 crash (kill -9, comes back with data)"
  bash tests/crash.sh 2>&1 | grep -E "FAIL|RESULT" | sed 's/^/  /'
fi

echo
echo "PRE-FLIGHT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
