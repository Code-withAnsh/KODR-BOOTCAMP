#!/usr/bin/env bash
# Phase 4 verification: data survives crashes, and the stack comes back on its own.
#
# How a "crash" is simulated: SIGKILL the container's MAIN process from the host
# (same as the event's instruction). `docker kill` does NOT trigger the restart policy,
# so it is not used here.
#   - On this Mac (Colima VM):  colima ssh -- sudo kill -9 <pid>
#   - On the EC2 box (plain Linux): sudo kill -9 <pid>
#
# Usage: bash tests/crash.sh      (run from the project root; docker compose must be up)
set -u
cd "$(dirname "$0")/.." || exit 2

BASE=${BASE_URL:-http://localhost:8080}
RUN=$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 6)
PID_ID="pcrash${RUN}"
PASS=0
FAIL=0

ok()   { PASS=$((PASS+1)); echo "  ok   $1"; }
fail() { FAIL=$((FAIL+1)); echo "  FAIL $1 -> $2"; }

# SIGKILL the main process of a compose service, from the host side.
crash_service() {
  local id pid
  id=$(docker compose ps -q "$1")
  pid=$(docker inspect -f '{{.State.Pid}}' "$id")
  if command -v colima >/dev/null 2>&1 && colima status >/dev/null 2>&1; then
    colima ssh -- sudo kill -9 "$pid"
  else
    sudo kill -9 "$pid"
  fi
}

restart_count() {
  docker inspect -f '{{.RestartCount}}' "$(docker compose ps -q "$1")"
}

# Wait until /health returns 200, up to N seconds.
wait_healthy() {
  local max=${1:-60} i=0 code
  while [ $i -lt $max ]; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/health")
    [ "$code" = "200" ] && return 0
    sleep 1; i=$((i+1))
  done
  return 1
}

stock_of() {
  curl -s "$BASE/products/$PID_ID" | sed -n 's/.*"stock":\([0-9-]*\).*/\1/p'
}

echo "Run id: $RUN"

echo "[setup]"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/products" -H 'content-type: application/json' \
  -d "{\"id\":\"$PID_ID\",\"name\":\"Crash Test\",\"category\":\"ccrash$RUN\",\"price\":100,\"stock\":50}")
[ "$code" = "201" ] && ok "product created (201)" || fail "product created" "got $code"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/orders" -H 'content-type: application/json' \
  -d "{\"userId\":\"ucrash$RUN\",\"productId\":\"$PID_ID\"}")
[ "$code" = "201" ] && ok "one order placed (201), stock should be 49" || fail "order placed" "got $code"

echo "[1. SIGKILL the app main process]"
r0=$(restart_count app)
crash_service app
sleep 3
r1=$(restart_count app)
[ "$r1" -gt "$r0" ] && ok "docker restarted the app by itself (restarts $r0 -> $r1)" || fail "app restart" "restarts $r0 -> $r1"
if wait_healthy 60; then ok "app /health 200 again"; else fail "app health" "no 200 in 60s"; fi
s=$(stock_of)
[ "$s" = "49" ] && ok "product still there, stock=49 after app crash" || fail "product after app crash" "stock=$s"
o=$(curl -s "$BASE/users/ucrash$RUN/orders" | grep -o '"orderId"' | wc -l | tr -d ' ')
[ "$o" = "1" ] && ok "order still listed after app crash" || fail "order after app crash" "count=$o"

echo "[2. SIGKILL MongoDB main process]"
r0=$(restart_count mongo)
crash_service mongo
sleep 3
r1=$(restart_count mongo)
[ "$r1" -gt "$r0" ] && ok "docker restarted mongo by itself (restarts $r0 -> $r1)" || fail "mongo restart" "restarts $r0 -> $r1"
if wait_healthy 90; then ok "app /health 200 after Mongo crash"; else fail "after Mongo crash" "no 200 in 90s"; fi
s=$(stock_of)
[ "$s" = "49" ] && ok "stock=49 survived Mongo SIGKILL (data on volume)" || fail "stock after Mongo crash" "stock=$s"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/orders" -H 'content-type: application/json' \
  -d "{\"userId\":\"ucrash2$RUN\",\"productId\":\"$PID_ID\"}")
[ "$code" = "201" ] && ok "new order works after Mongo restart (201)" || fail "order after Mongo restart" "got $code"

echo "[3. full stack down and up, volumes kept]"
docker compose down >/dev/null 2>&1
docker compose up -d >/dev/null 2>&1
if wait_healthy 90; then ok "stack back up after compose down/up"; else fail "compose down/up" "no 200 in 90s"; fi
s=$(stock_of)
[ "$s" = "48" ] && ok "stock=48 (both orders kept) after full restart" || fail "stock after full restart" "stock=$s"

echo "[4. restart policy]"
for svc in app mongo; do
  id=$(docker compose ps -q $svc)
  pol=$(docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' "$id")
  [ "$pol" = "unless-stopped" ] && ok "$svc restart policy = unless-stopped" || fail "$svc restart policy" "$pol"
done

echo
echo "RESULT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
