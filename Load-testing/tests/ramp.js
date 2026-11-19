'use strict';
// Event-style ramp test (event spec sections 06-08), our own approximation.
//   seed 10,000 products / 50 categories / 100,000 units each
//   warm-up 60 s @ 200 req/s (unscored)
//   levels L1..L17, 30 s each, a new flash drop at the start of each level
//   a level passes when: p99 <= 100 ms, errors <= 1 %, wrong answers = 0 (and the flash audit holds)
//   stops at the first level that fails, then audits stock and order lists.
//
// Run it from a container/machine that is NOT the app (see tests/README in progress notes).
//   BASE=http://localhost:8080 node tests/ramp.js
// Optional env: START_LEVEL=1 MAX_LEVEL=17 PRODUCTS=10000 WARMUP_SECS=60 LEVEL_SECS=30

const autocannon = require('autocannon');

const BASE = process.env.BASE || 'http://localhost:8080';
const N_PROD = Number(process.env.PRODUCTS || 10000);
const N_CAT = 50;
const START_STOCK = 100000;
const WARMUP_SECS = Number(process.env.WARMUP_SECS || 60);
const LEVEL_SECS = Number(process.env.LEVEL_SECS || 30);
const START_LEVEL = Number(process.env.START_LEVEL || 1);
const MAX_LEVEL = Number(process.env.MAX_LEVEL || 17);
const RATES = [500, 1000, 1500, 2000, 3000, 4000, 5000, 6500, 8000, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 50000];

// NOCHECK=1: the generator only counts statuses (no JSON parsing / answer checks / audit).
// Use it to measure the SERVER's capacity when the generator shares the box and would otherwise eat a core.
const NOCHECK = process.env.NOCHECK === '1';

const RUN = Math.random().toString(36).slice(2, 7);
const H = { 'content-type': 'application/json' };
const rnd = (n) => Math.floor(Math.random() * n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- model of what we created ----------
const meta = new Map();          // productId -> { name, cat, price, start }
const prodIds = [];              // seeded product ids
const cats = [];                 // seeded category names
const byCat = new Map();         // cat -> product ids sorted by (price, id)
const sold = new Map();          // productId -> number of 201 we saw
const wins = [];                 // recent winners { userId, productId, orderId, at }
const WINS_MAX = 20000;
let winPos = 0;
let flash = null;                // { id, cat, start } of the current flash drop
let userSeq = 0;
let inflightAllowance = 0; // orders the generator may cancel at the end of a run: server commits them, we never see the 201

function recordWin(userId, productId, orderId) {
  sold.set(productId, (sold.get(productId) || 0) + 1);
  const w = { userId, productId, orderId, at: Date.now() };
  if (wins.length < WINS_MAX) wins.push(w); else { wins[winPos] = w; winPos = (winPos + 1) % WINS_MAX; }
}

// Control-plane calls (seed, flash create, audit) use Node's plain http module with a fresh
// connection per call and a hard timeout. (Node's fetch/undici reuses sockets and can return
// odd 408s or hang when a reused socket is reset; that is a client-side issue, not an answer.)
const http = require('http');
const baseUrl = new URL(BASE);
const agent = new http.Agent({ keepAlive: false, maxSockets: 200 });

function httpJson(method, path, bodyObj) {
  return new Promise((resolve, reject) => {
    const data = bodyObj === undefined ? null : JSON.stringify(bodyObj);
    const req = http.request({
      agent, method, hostname: baseUrl.hostname, port: baseUrl.port || 80, path,
      headers: data ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data) } : {},
      timeout: 5000,
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const t = Buffer.concat(chunks).toString();
        let j = null;
        try { j = JSON.parse(t); } catch (e) { /* ignore */ }
        resolve({ status: res.statusCode, json: j });
      });
    });
    req.on('timeout', () => req.destroy(new Error('request timeout')));
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function withRetry(fn) {
  let last;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try { return await fn(); } catch (e) { last = e; await sleep(200 * (attempt + 1)); }
  }
  throw last;
}
const post = (path, body) => withRetry(() => httpJson('POST', path, body));
const get = (path) => withRetry(() => httpJson('GET', path));

async function pool(items, size, fn) {
  let i = 0;
  const workers = Array.from({ length: size }, async () => {
    while (i < items.length) { const k = i; i += 1; await fn(items[k], k); }
  });
  await Promise.all(workers);
}

// ---------- seeding ----------
async function seed() {
  const t0 = Date.now();
  for (let c = 0; c < N_CAT; c += 1) cats.push(`c${RUN}${c}`);
  const list = [];
  for (let i = 0; i < N_PROD; i += 1) {
    const id = `p${RUN}${i}`;
    const cat = cats[i % N_CAT];
    const price = 100 * (1 + rnd(30)); // lots of equal prices on purpose
    list.push({ id, name: `Item ${i}`, category: cat, price, stock: START_STOCK });
  }
  let failed = 0;
  await pool(list, 50, async (p) => {
    const r = await post('/products', p);
    if (r.status !== 201) failed += 1;
  });
  for (const p of list) {
    meta.set(p.id, { name: p.name, cat: p.category, price: p.price, start: START_STOCK });
    prodIds.push(p.id);
    if (!byCat.has(p.category)) byCat.set(p.category, []);
    byCat.get(p.category).push(p);
  }
  for (const [c, arr] of byCat) {
    arr.sort((a, b) => a.price - b.price || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    byCat.set(c, arr.map((p) => p.id));
  }
  console.log(`seeded ${N_PROD} products in ${((Date.now() - t0) / 1000).toFixed(1)} s, failed=${failed}`);
  if (failed) throw new Error('seeding failed');
}

async function makeFlash(level) {
  const start = 50 + rnd(151);
  const id = `pf${RUN}${level}`;
  const cat = `cf${RUN}${level}`;
  const name = `Flash ${level}`;
  const r = await post('/products', { id, name, category: cat, price: 2999, stock: start });
  if (r.status !== 201) throw new Error('flash create failed ' + r.status + ' ' + JSON.stringify(r.json));
  meta.set(id, { name, cat, price: 2999, start });
  flash = { id, cat, start };
}

// ---------- request mix + answer checks ----------
let S = null; // stats of the level being run
const bad = (msg) => { S.wrong += 1; if (S.samples.length < 5) S.samples.push(msg); };
const parse = (b) => { try { return JSON.parse(b); } catch (e) { return undefined; } };

function pickProduct() {
  if (flash && Math.random() < 0.15) return flash.id; // people refreshing the flash page
  return Math.random() < 0.7 ? prodIds[rnd(100)] : prodIds[rnd(prodIds.length)];
}

function onStatusClass(status) {
  if (status >= 500 || status === 429) { S.err5xx += 1; return false; }
  return true;
}

function reqRead(req, ctx) {
  if (Math.random() < 0.02) {
    ctx.exp = { t: 'read404' };
    return { ...req, method: 'GET', path: `/products/pmissing${RUN}${rnd(1e9)}` };
  }
  const id = pickProduct();
  ctx.exp = { t: 'read', id };
  return { ...req, method: 'GET', path: `/products/${id}` };
}

function reqList(req, ctx) {
  const cat = cats[rnd(cats.length)];
  const page = Math.random() < 0.8 ? 1 : 1 + rnd(10);
  const limit = [10, 20, 50][rnd(3)];
  ctx.exp = { t: 'list', cat, page, limit };
  return { ...req, method: 'GET', path: `/products?category=${cat}&page=${page}&limit=${limit}` };
}

function reqOrder(req, ctx) {
  const useFlash = flash && Math.random() < 0.7;
  const productId = useFlash ? flash.id : prodIds[rnd(prodIds.length)];
  // ~3 % of orders repeat an order the user already won
  if (wins.length > 0 && Math.random() < 0.03) {
    const w = wins[rnd(wins.length)];
    ctx.exp = { t: 'retry', productId: w.productId };
    return { ...req, method: 'POST', path: '/orders', headers: H, body: JSON.stringify({ userId: w.userId, productId: w.productId }) };
  }
  const userId = `u${RUN}${userSeq}`;
  userSeq += 1;
  ctx.exp = { t: 'order', userId, productId, isFlash: useFlash };
  return { ...req, method: 'POST', path: '/orders', headers: H, body: JSON.stringify({ userId, productId }) };
}

function reqUser(req, ctx) {
  const old = Date.now() - 3000; // list may be up to 2 s old: only check winners settled for 3 s
  if (wins.length > 0 && Math.random() < 0.8) {
    const w = wins[rnd(wins.length)];
    if (w.at <= old) {
      ctx.exp = { t: 'userHas', userId: w.userId, productId: w.productId, orderId: w.orderId };
      return { ...req, method: 'GET', path: `/users/${w.userId}/orders` };
    }
  }
  const userId = `unone${RUN}${rnd(1e9)}`;
  ctx.exp = { t: 'userNone', userId };
  return { ...req, method: 'GET', path: `/users/${userId}/orders` };
}

function setupRequest(req, ctx) {
  const r = Math.random();
  if (r < 0.60) return reqRead(req, ctx);
  if (r < 0.75) return reqList(req, ctx);
  if (r < 0.95) return reqOrder(req, ctx);
  return reqUser(req, ctx);
}

function check(status, body, ctx) {
  const e = ctx.exp;
  if (!e || !onStatusClass(status)) return;
  const j = parse(body);
  switch (e.t) {
    case 'read404':
      if (status !== 404 || !j || j.error !== 'PRODUCT_NOT_FOUND') bad(`read404 got ${status}`);
      break;
    case 'read': {
      const m = meta.get(e.id);
      if (status !== 200 || !j) { bad(`read ${e.id} got ${status}`); break; }
      if (j.id !== e.id || j.name !== m.name || j.category !== m.cat || j.price !== m.price ||
          !Number.isInteger(j.stock) || j.stock < 0 || j.stock > m.start) bad(`read ${e.id} wrong body ${body.slice(0, 120)}`);
      break;
    }
    case 'list': {
      const exp = byCat.get(e.cat);
      if (status !== 200 || !j || !Array.isArray(j.items)) { bad(`list got ${status}`); break; }
      const from = (e.page - 1) * e.limit;
      const expIds = exp.slice(from, from + e.limit);
      const got = j.items.map((i) => i.id);
      if (j.total !== exp.length || j.page !== e.page || j.limit !== e.limit || got.length !== expIds.length ||
          got.some((id, k) => id !== expIds[k])) bad(`list ${e.cat} p${e.page} l${e.limit} wrong content/order`);
      break;
    }
    case 'order': {
      if (status === 201) {
        if (!j || typeof j.orderId !== 'string' || !j.orderId || j.userId !== e.userId || j.productId !== e.productId) {
          bad(`order 201 wrong body ${body.slice(0, 100)}`);
        } else { recordWin(e.userId, e.productId, j.orderId); }
      } else if (status === 409 && j && j.error === 'SOLD_OUT') {
        if (!e.isFlash) bad(`SOLD_OUT on regular product ${e.productId}`);
      } else bad(`first-time order got ${status} ${body.slice(0, 60)}`);
      break;
    }
    case 'retry': {
      const isFlash = flash && e.productId === flash.id;
      const okAlready = status === 409 && j && j.error === 'ALREADY_PURCHASED';
      const okSold = status === 409 && j && j.error === 'SOLD_OUT' && String(e.productId).startsWith(`pf${RUN}`);
      if (!okAlready && !okSold && !isFlash) bad(`retry got ${status} ${body.slice(0, 60)}`);
      else if (!okAlready && !okSold) bad(`retry (flash) got ${status}`);
      break;
    }
    case 'userHas':
      if (status !== 200 || !j || j.userId !== e.userId || !Array.isArray(j.orders) ||
          !j.orders.some((o) => o.orderId === e.orderId && o.productId === e.productId)) bad(`user ${e.userId} list missing order`);
      break;
    case 'userNone':
      if (status !== 200 || !j || j.userId !== e.userId || !Array.isArray(j.orders) || j.orders.length !== 0) bad(`user none got ${status}`);
      break;
    default:
  }
}

// ~2 % of orders are double-clicks: the same order twice at the same instant.
function startDoubleClicks(rate) {
  const perTick = rate * 0.2 * 0.02 * 0.1; // orders/s * 2 % * 100 ms
  let acc = 0;
  const timer = setInterval(() => {
    acc += perTick;
    while (acc >= 1) {
      acc -= 1;
      const useFlash = flash && Math.random() < 0.7;
      const productId = useFlash ? flash.id : prodIds[rnd(prodIds.length)];
      const userId = `u${RUN}d${userSeq}`;
      userSeq += 1;
      const orderBody = { userId, productId };
      Promise.all([
        httpJson('POST', '/orders', orderBody).then((r) => ({ s: r.status, j: r.json })),
        httpJson('POST', '/orders', orderBody).then((r) => ({ s: r.status, j: r.json })),
      ]).then(([a, b]) => {
        const rs = [a, b];
        const n201 = rs.filter((x) => x.s === 201).length;
        if (rs.some((x) => x.s >= 500 || x.s === 429)) { S.err5xx += 1; return; }
        if (n201 > 1) bad(`double-click: ${n201} x 201 for ${productId}`);
        const winner = rs.find((x) => x.s === 201);
        if (winner && winner.j) recordWin(userId, productId, winner.j.orderId);
        if (!useFlash && n201 !== 1) bad(`double-click on regular product gave ${n201} x 201`);
      }).catch(() => { S.err5xx += 1; });
    }
  }, 100);
  return () => clearInterval(timer);
}

// ---------- running a level ----------
async function runLevel(label, rate, secs, scored) {
  S = { wrong: 0, err5xx: 0, samples: [] };
  const conns = Math.min(2000, Math.max(50, Math.round(rate / 8)));
  inflightAllowance += conns + 20; // up to one request per connection, plus a few double-click pairs
  const stopDC = startDoubleClicks(rate);
  const res = await autocannon({
    url: BASE,
    connections: conns,
    duration: secs,
    overallRate: rate,
    timeout: 2,
    requests: [{
      setupRequest,
      onResponse: NOCHECK
        ? (status) => { if (status >= 500 || status === 429) S.err5xx += 1; }
        : (status, body, ctx) => check(status, body, ctx),
    }],
  });
  stopDC();
  await sleep(3000); // settle, like the event (3 s before the audit)

  const expected = rate * secs;
  const done = res.requests.total;
  const socketErr = res.errors + res.timeouts;
  const shortfall = Math.max(0, expected - done - socketErr);
  const errCount = socketErr + S.err5xx + shortfall;
  const errPct = (errCount / expected) * 100;
  const out = {
    label, rate, conns, p50: res.latency.p50, p99: res.latency.p99, max: res.latency.max,
    achieved: Math.round(done / secs), errPct: Number(errPct.toFixed(2)),
    socketErr, err5xx: S.err5xx, unsent: shortfall, wrong: S.wrong, samples: S.samples,
  };

  // flash-drop audit: every drop must end at stock 0 with exactly `start` orders
  if (scored && flash && !NOCHECK) {
    const g = await get(`/products/${flash.id}`);
    const sales = sold.get(flash.id) || 0;
    out.flash = { start: flash.start, stock: g.json && g.json.stock, orders: sales };
    if (!g.json || g.json.stock !== 0) { out.wrong += 1; out.samples.push(`flash stock ${g.json && g.json.stock}, expected 0`); }
    else if (sales !== flash.start && socketErr === 0 && S.err5xx === 0) { out.wrong += 1; out.samples.push(`flash 201s ${sales} != start ${flash.start}`); }
  }
  out.pass = res.latency.p99 <= 100 && errPct <= 1 && out.wrong === 0 && shortfall / expected <= 0.01;
  return out;
}

function line(o) {
  if (o.label === 'warmup') {
    return `warmup  ${o.rate}/s  achieved ${o.achieved}/s  p50 ${o.p50} ms  p99 ${o.p99} ms  err ${o.errPct}%  wrong ${o.wrong}  (unscored)`;
  }
  return `${o.label.padEnd(7)} ${String(o.rate).padStart(6)}/s  achieved ${String(o.achieved).padStart(6)}/s  p50 ${String(o.p50).padStart(4)} ms  p99 ${String(o.p99).padStart(5)} ms  ` +
    `err ${String(o.errPct).padStart(5)}%  wrong ${String(o.wrong).padStart(3)}  conns ${o.conns}  ${o.pass ? 'PASS' : 'FAIL'}` +
    (o.flash ? `  flash ${o.flash.orders}/${o.flash.start} stock ${o.flash.stock}` : '');
}

// ---------- final audit ----------
async function finalAudit(totalErrors) {
  // expected = start - (201s we saw). The server may have committed a few more orders whose
  // 201 we never saw (requests cancelled at the end of a run, timeouts). That makes stock LOWER than
  // expected by a small amount. Stock HIGHER than expected (an order we saw succeed did not take a
  // unit) or a larger deficit than the cancellations can explain is a real problem.
  const bad2 = [];
  let totalDeficit = 0;
  const ids = [...sold.keys()];
  await pool(ids, 50, async (id) => {
    const g = await get(`/products/${id}`);
    const m = meta.get(id);
    const expected = m.start - sold.get(id);
    if (!g.json) { bad2.push(`${id}: no product`); return; }
    if (g.json.stock < 0) bad2.push(`${id}: negative stock`);
    if (g.json.stock > expected) bad2.push(`${id}: stock ${g.json.stock} > expected ${expected} (a 201 did not take a unit)`);
    else totalDeficit += expected - g.json.stock;
  });
  const allowed = inflightAllowance + totalErrors;
  if (totalDeficit > allowed) bad2.push(`total deficit ${totalDeficit} > allowance ${allowed}`);
  const sample = wins.length > 300 ? Array.from({ length: 300 }, () => wins[rnd(wins.length)]) : wins;
  let missing = 0;
  await pool(sample, 50, async (w) => {
    const g = await get(`/users/${w.userId}/orders`);
    if (!g.json || !g.json.orders.some((o) => o.orderId === w.orderId)) missing += 1;
  });
  return { productsChecked: ids.length, totalDeficit, deficitAllowance: allowed, stockProblems: bad2.slice(0, 5), stockProblemCount: bad2.length, ordersSampled: sample.length, missingOrders: missing };
}

async function main() {
  console.log(`ramp test, run ${RUN}, target ${BASE}`);
  const h = await get('/health');
  if (h.status !== 200) throw new Error('server not healthy');
  await seed();

  console.log(`warm-up ${WARMUP_SECS} s @ 200 req/s (unscored)`);
  flash = null;
  const w = await runLevel('warmup', 200, WARMUP_SECS, false);
  console.log(line(w));

  const results = [];
  let lastPass = null;
  let totalErrors = w.socketErr + w.err5xx;
  for (let lv = START_LEVEL; lv <= MAX_LEVEL; lv += 1) {
    await makeFlash(lv);
    const o = await runLevel(`L${lv}`, RATES[lv - 1], LEVEL_SECS, true);
    console.log(line(o));
    if (o.samples.length) console.log('   samples:', JSON.stringify(o.samples));
    results.push(o);
    totalErrors += o.socketErr + o.err5xx + o.unsent;
    // CAPACITY=1: keep climbing past a failed level (to see where throughput really breaks),
    // but stop on wrong answers or once errors exceed 5 %.
    if (process.env.CAPACITY === '1') {
      if (o.pass && !lastPass) lastPass = o;
      if (o.pass) lastPass = o;
      if (o.wrong > 0 || o.errPct > 5) break;
      continue;
    }
    if (!o.pass) break;
    lastPass = o;
  }

  const audit = NOCHECK ? { skipped: 'NOCHECK mode', stockProblemCount: 0, missingOrders: 0 } : await finalAudit(totalErrors);
  console.log('\nAUDIT', JSON.stringify(audit));
  const score = lastPass ? lastPass.rate : 0;
  console.log(`\nSCORE (highest passed level): ${score} req/s` + (lastPass ? `  [${lastPass.label}, p99 ${lastPass.p99} ms]` : ''));
  const auditOk = audit.stockProblemCount === 0 && audit.missingOrders === 0;
  console.log(`audit: ${auditOk ? 'OK' : 'PROBLEMS'}`);
  process.exit(auditOk ? 0 : 1);
}

main().catch((e) => { console.error('ramp crashed:', e); process.exit(2); });
