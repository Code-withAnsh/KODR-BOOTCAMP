'use strict';
// Functional + correctness test for the flash-sale API.
// Usage: node tests/functional.js            (BASE_URL defaults to http://localhost:8080)
// Uses a random run id in every id, so it can be re-run on the same database.

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const RUN = Math.random().toString(36).slice(2, 8);
let passed = 0;
let failed = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(method, path, body) {
  const init = { method, headers: {} };
  if (body !== undefined) {
    init.headers['content-type'] = 'application/json';
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(BASE + path, init);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* leave null */ }
  return { status: res.status, json, ct: res.headers.get('content-type') || '' };
}

function check(name, cond, detail) {
  if (cond) { passed += 1; console.log('  ok   ' + name); } else {
    failed += 1;
    console.log('  FAIL ' + name + (detail !== undefined ? '  -> ' + JSON.stringify(detail) : ''));
  }
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function mk(id, over) {
  return Object.assign({ id: `p${RUN}${id}`, name: 'Item ' + id, category: `c${RUN}`, price: 100, stock: 10 }, over);
}

async function main() {
  console.log('Run id:', RUN, ' target:', BASE);

  console.log('\n[health]');
  let r = await call('GET', '/health');
  check('GET /health 200 {status:ok}', r.status === 200 && eq(r.json, { status: 'ok' }), r);

  console.log('\n[POST /products]');
  const pix = mk('pixel', { name: 'Pixel 10 Pro 256GB', price: 79999, stock: 120 });
  r = await call('POST', '/products', pix);
  check('201 and product echoed', r.status === 201 && eq(r.json, pix), r);
  check('content-type json', r.ct.includes('application/json'), r.ct);
  r = await call('POST', '/products', mk('pixel', { name: 'Pixel 512', price: 89999, stock: 50 }));
  check('409 PRODUCT_EXISTS', r.status === 409 && eq(r.json, { error: 'PRODUCT_EXISTS' }), r);
  r = await call('GET', `/products/${pix.id}`);
  check('original untouched after 409', r.status === 200 && eq(r.json, pix), r);

  const badProducts = {
    'missing id': (() => { const p = mk('v1'); delete p.id; return p; })(),
    'missing name': (() => { const p = mk('v2'); delete p.name; return p; })(),
    'empty category': mk('v3', { category: '' }),
    'negative price': mk('v4', { price: -5 }),
    'fractional price': mk('v5', { price: 1.5 }),
    'string price': mk('v6', { price: '5' }),
    'negative stock': mk('v7', { stock: -1 }),
    'string stock': mk('v8', { stock: '3' }),
    'name too long': mk('v9', { name: 'x'.repeat(201) }),
    'id too long': mk('v10', { id: 'p'.repeat(65) }),
    'numeric id': mk('v11', { id: 123 }),
    'missing stock': (() => { const p = mk('v12'); delete p.stock; return p; })(),
  };
  for (const [name, body] of Object.entries(badProducts)) {
    r = await call('POST', '/products', body);
    check('400 for ' + name, r.status === 400 && eq(r.json, { error: 'VALIDATION_ERROR' }), r);
  }
  r = await call('POST', '/products', '{bad json');
  check('400 for malformed JSON', r.status === 400 && eq(r.json, { error: 'VALIDATION_ERROR' }), r);
  r = await call('POST', '/products', []);
  check('400 for array body', r.status === 400, r);
  r = await call('POST', '/products', mk('extra', { _id: 'zzz', __v: 1, junk: true }));
  check('extra fields ignored (201)', r.status === 201, r);

  console.log('\n[GET /products/:id]');
  r = await call('GET', '/products/p000000000000');
  check('404 PRODUCT_NOT_FOUND', r.status === 404 && eq(r.json, { error: 'PRODUCT_NOT_FOUND' }), r);

  console.log('\n[GET /products?category=...]');
  const cat = `clist${RUN}`;
  const listSeed = [['b', 300], ['a', 100], ['c', 100], ['d', 200], ['e', 100]];
  for (const [suffix, price] of listSeed) {
    await call('POST', '/products', mk('L' + suffix, { category: cat, price, stock: 5 }));
  }
  // expected by price asc then id asc: La(100) Lc(100) Le(100) Ld(200) Lb(300)
  const expectedIds = ['a', 'c', 'e', 'd', 'b'].map((s) => `p${RUN}L${s}`);
  r = await call('GET', `/products?category=${cat}`);
  check('default page=1 limit=20, sorted, total', r.status === 200 && r.json.page === 1 && r.json.limit === 20 &&
    r.json.total === 5 && eq(r.json.items.map((i) => i.id), expectedIds), r);
  check('item has exactly id,name,category,price,stock',
    eq(Object.keys(r.json.items[0]).sort(), ['category', 'id', 'name', 'price', 'stock']), r.json.items[0]);
  r = await call('GET', `/products?category=${cat}&page=1&limit=2`);
  check('page1 limit2', eq(r.json.items.map((i) => i.id), expectedIds.slice(0, 2)) && r.json.total === 5, r.json);
  r = await call('GET', `/products?category=${cat}&page=2&limit=2`);
  check('page2 limit2', eq(r.json.items.map((i) => i.id), expectedIds.slice(2, 4)), r.json);
  r = await call('GET', `/products?category=${cat}&page=3&limit=2`);
  check('page3 limit2 (last, 1 item)', eq(r.json.items.map((i) => i.id), expectedIds.slice(4)), r.json);
  r = await call('GET', `/products?category=${cat}&page=20`);
  check('page past end -> items [] real total', r.status === 200 && eq(r.json.items, []) && r.json.total === 5 && r.json.page === 20, r.json);
  r = await call('GET', `/products?category=cnone${RUN}`);
  check('empty category', r.status === 200 && eq(r.json, { items: [], page: 1, limit: 20, total: 0 }), r.json);
  for (const q of ['', '?page=2', '?category=', `?category=${cat}&limit=80`, `?category=${cat}&limit=51`,
    `?category=${cat}&limit=0`, `?category=${cat}&limit=abc`, `?category=${cat}&page=0`,
    `?category=${cat}&page=-1`, `?category=${cat}&page=x`, `?category=${cat}&page=1.5`, `?category=${cat}&page=`,
    `?category=${cat}&category=${cat}`]) {
    r = await call('GET', '/products' + q);
    check('400 for /products' + q, r.status === 400 && eq(r.json, { error: 'VALIDATION_ERROR' }), r);
  }
  r = await call('GET', `/products?category=${cat}&limit=50`);
  check('limit=50 allowed', r.status === 200 && r.json.limit === 50, r.json);

  console.log('\n[POST /orders]');
  const shopP = mk('shop', { stock: 3 });
  await call('POST', '/products', shopP);
  const u1 = `u${RUN}1`;
  const u2 = `u${RUN}2`;
  for (const [name, body] of Object.entries({
    'missing productId': { userId: u1 },
    'missing userId': { productId: shopP.id },
    'empty userId': { userId: '', productId: shopP.id },
    'numeric productId': { userId: u1, productId: 5 },
    'empty body': {},
  })) {
    r = await call('POST', '/orders', body);
    check('400 for ' + name, r.status === 400 && eq(r.json, { error: 'VALIDATION_ERROR' }), r);
  }
  r = await call('POST', '/orders', { userId: u1, productId: 'p000000000000' });
  check('404 PRODUCT_NOT_FOUND', r.status === 404 && eq(r.json, { error: 'PRODUCT_NOT_FOUND' }), r);
  r = await call('POST', '/orders', {});
  check('400 wins over 404 (empty body)', r.status === 400, r);
  r = await call('POST', '/orders', { userId: u1, productId: shopP.id });
  check('201 order shape', r.status === 201 && typeof r.json.orderId === 'string' && r.json.orderId.length > 0 &&
    r.json.userId === u1 && r.json.productId === shopP.id, r);
  const orderId1 = r.json && r.json.orderId;
  r = await call('POST', '/orders', { userId: u1, productId: shopP.id });
  check('409 ALREADY_PURCHASED', r.status === 409 && eq(r.json, { error: 'ALREADY_PURCHASED' }), r);
  r = await call('GET', `/products/${shopP.id}`);
  check('stock 3 -> 2 after one order, error order took nothing', r.json.stock === 2, r.json);
  r = await call('GET', `/users/${u1}/orders`);
  check('user orders lists the order', r.status === 200 && r.json.userId === u1 &&
    eq(r.json.orders, [{ orderId: orderId1, productId: shopP.id }]), r.json);
  r = await call('GET', `/users/${u2}/orders`);
  check('user without orders -> 200 []', r.status === 200 && eq(r.json, { userId: u2, orders: [] }), r.json);

  const soldP = mk('sold0', { stock: 0 });
  await call('POST', '/products', soldP);
  r = await call('POST', '/orders', { userId: u2, productId: soldP.id });
  check('409 SOLD_OUT on stock 0', r.status === 409 && eq(r.json, { error: 'SOLD_OUT' }), r);
  r = await call('GET', `/users/${u2}/orders`);
  check('no ghost order after SOLD_OUT', eq(r.json.orders, []), r.json);
  r = await call('GET', `/products/${soldP.id}`);
  check('stock stays 0, never negative', r.json.stock === 0, r.json);

  console.log('\n[concurrency 1: last unit, 50 buyers at once]');
  const last = mk('last1', { stock: 1 });
  await call('POST', '/products', last);
  let rs = await Promise.all(Array.from({ length: 50 }, (_, i) =>
    call('POST', '/orders', { userId: `u${RUN}L${i}`, productId: last.id })));
  let counts = {};
  rs.forEach((x) => { const k = x.status + (x.json && x.json.error ? ':' + x.json.error : ''); counts[k] = (counts[k] || 0) + 1; });
  check('exactly one 201, 49 SOLD_OUT', counts['201'] === 1 && counts['409:SOLD_OUT'] === 49 && Object.keys(counts).length === 2, counts);
  await sleep(1100);
  r = await call('GET', `/products/${last.id}`);
  check('last unit stock = 0', r.json.stock === 0, r.json);
  const winners = [];
  for (let i = 0; i < 50; i += 1) {
    const o = await call('GET', `/users/${`u${RUN}L${i}`}/orders`);
    if (o.json.orders.length) winners.push(i);
  }
  check('exactly one user has the order', winners.length === 1, winners);

  console.log('\n[concurrency 2: double-click, same user 20x at once]');
  const click = mk('click', { stock: 1000 });
  await call('POST', '/products', click);
  const dbl = `u${RUN}double`;
  rs = await Promise.all(Array.from({ length: 20 }, () => call('POST', '/orders', { userId: dbl, productId: click.id })));
  counts = {};
  rs.forEach((x) => { const k = x.status + (x.json && x.json.error ? ':' + x.json.error : ''); counts[k] = (counts[k] || 0) + 1; });
  check('exactly one 201, 19 ALREADY_PURCHASED', counts['201'] === 1 && counts['409:ALREADY_PURCHASED'] === 19, counts);
  await sleep(1100);
  r = await call('GET', `/products/${click.id}`);
  check('stock 999', r.json.stock === 999, r.json);
  r = await call('GET', `/users/${dbl}/orders`);
  check('exactly one order in list', r.json.orders.length === 1, r.json);

  console.log('\n[concurrency 3: flash drop, 150 units, 600 buyers]');
  const flash = mk('flash', { stock: 150, category: `cflash${RUN}` });
  await call('POST', '/products', flash);
  rs = await Promise.all(Array.from({ length: 600 }, (_, i) =>
    call('POST', '/orders', { userId: `u${RUN}F${i}`, productId: flash.id })));
  counts = {};
  rs.forEach((x) => { const k = x.status + (x.json && x.json.error ? ':' + x.json.error : ''); counts[k] = (counts[k] || 0) + 1; });
  check('exactly 150 x 201, 450 x SOLD_OUT, nothing else', counts['201'] === 150 && counts['409:SOLD_OUT'] === 450 &&
    Object.keys(counts).length === 2, counts);
  await sleep(1100);
  r = await call('GET', `/products/${flash.id}`);
  check('flash drop ends at stock 0', r.json.stock === 0, r.json);
  const won = rs.map((x, i) => (x.status === 201 ? i : -1)).filter((i) => i >= 0);
  let missing = 0;
  for (const i of won.slice(0, 30)) {
    const o = await call('GET', `/users/${`u${RUN}F${i}`}/orders`);
    if (!o.json.orders.some((x) => x.productId === flash.id)) missing += 1;
  }
  check('sampled winners all have their order listed', missing === 0, missing);

  console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error('test crashed:', e); process.exit(2); });
