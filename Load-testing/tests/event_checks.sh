#!/usr/bin/env bash
# Phase 5: the event's own tests 1 and 2, run exactly like the spec (curl -Z parallel).
# Test 3 (crash) is tests/crash.sh.
# Each run uses a new product id, so the script can be repeated.
#
# Usage: bash tests/event_checks.sh [runs]     (default 5)
set -u
BASE=${BASE_URL:-http://localhost:8080}
RUNS=${1:-5}
PASS=0
FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ok   $1"; }
fail() { FAIL=$((FAIL+1)); echo "  FAIL $1 -> $2"; }

# Test 1 - the last unit: 1 unit, 50 different users press Buy at the same moment.
test_last_unit() {
  local id="$1"
  curl -s -o /dev/null -w '%{http_code}' -X POST localhost:8080/products -H 'content-type: application/json' \
    -d "{\"id\":\"$id\",\"name\":\"Last One\",\"category\":\"ctest\",\"price\":100,\"stock\":1}" >/dev/null
  local args=()
  for i in $(seq 50); do
    [ "$i" -gt 1 ] && args+=(--next)
    args+=(-s -o /dev/null -w '%{http_code}\n' -X POST -H 'content-type: application/json' \
           -d "{\"userId\":\"u$id$i\",\"productId\":\"$id\"}" "$BASE/orders")
  done
  local out
  out=$(curl -Z --parallel-immediate --parallel-max 50 "${args[@]}" | sort | uniq -c)
  local n201 n409
  n201=$(echo "$out" | awk '$2=="201"{print $1}'); n201=${n201:-0}
  n409=$(echo "$out" | awk '$2=="409"{print $1}'); n409=${n409:-0}
  local stock
  stock=$(curl -s "$BASE/products/$id" | sed -n 's/.*"stock":\([0-9-]*\).*/\1/p')
  if [ "$n201" = "1" ] && [ "$n409" = "49" ] && [ "$stock" = "0" ]; then
    ok "test1 last unit: 1x201, 49x409, stock 0"
  else
    fail "test1 last unit ($id)" "201=$n201 409=$n409 stock=$stock"
  fi
}

# Test 2 - double-click: same user sends the same order 20 times at the same instant.
test_double_click() {
  local id="$1" user="ud$1"
  curl -s -o /dev/null -X POST localhost:8080/products -H 'content-type: application/json' \
    -d "{\"id\":\"$id\",\"name\":\"Click Test\",\"category\":\"ctest\",\"price\":100,\"stock\":1000}"
  local args=()
  for i in $(seq 20); do
    [ "$i" -gt 1 ] && args+=(--next)
    args+=(-s -o /dev/null -w '%{http_code}\n' -X POST -H 'content-type: application/json' \
           -d "{\"userId\":\"$user\",\"productId\":\"$id\"}" "$BASE/orders")
  done
  local out
  out=$(curl -Z --parallel-immediate --parallel-max 20 "${args[@]}" | sort | uniq -c)
  local n201 n409
  n201=$(echo "$out" | awk '$2=="201"{print $1}'); n201=${n201:-0}
  n409=$(echo "$out" | awk '$2=="409"{print $1}'); n409=${n409:-0}
  local stock orders
  stock=$(curl -s "$BASE/products/$id" | sed -n 's/.*"stock":\([0-9-]*\).*/\1/p')
  orders=$(curl -s "$BASE/users/$user/orders" | grep -o '"orderId"' | wc -l | tr -d ' ')
  if [ "$n201" = "1" ] && [ "$n409" = "19" ] && [ "$stock" = "999" ] && [ "$orders" = "1" ]; then
    ok "test2 double-click: 1x201, 19x409, stock 999, 1 order in list"
  else
    fail "test2 double-click ($id)" "201=$n201 409=$n409 stock=$stock orders=$orders"
  fi
}

RUN=$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 5)
for r in $(seq "$RUNS"); do
  echo "[run $r/$RUNS]"
  test_last_unit "plast${RUN}${r}"
  test_double_click "pclick${RUN}${r}"
done

echo
echo "RESULT: $PASS passed, $FAIL failed (runs=$RUNS)"
[ "$FAIL" -eq 0 ]
