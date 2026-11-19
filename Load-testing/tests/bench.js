'use strict';
// Mixed-traffic benchmark shaped like the event (section 06):
//   60% GET /products/:id   (skewed: a few hot products)
//   15% GET /products?category=...&page=...&limit=...
//   20% POST /orders        (70% flash drop, 30% regular, every user unique)
//    5% GET /users/:id/orders
// Run from a container on the same Docker network as the app (see phase 6 notes).
// Usage: BASE=http://app:8080 CONNS=100 SECS=15 node tests/bench.js

const autocannon = require('autocannon');

const BASE = process.env.BASE || 'http://app:8080';
const CONNS = Number(process.env.CONNS || 100);
const SECS = Number(process.env.SECS || 15);
const RUN = Math.random().toString(36).slice(2, 7);

const rnd = (n) => Math.floor(Math.random() * n);
const j = (o) => JSON.stringify(o);
const H = { 'content-type': 'application/json' };

async function post(path, body) {
  const r = await fetch(BASE + path, { method: 'POST', headers: H, body: j(body) });
  return r.status;
}

async function seed() {
  const hot = [];
  for (let i = 0; i < 20; i += 1) {
    const id = `bh${RUN}${i}`;
    await post('/products', { id, name: 'Hot ' + i, category: `cb${RUN}`, price: 100 + i, stock: 100000 });
    hot.push(id);
  }
  const cats = [];
  for (let c = 0; c < 5; c += 1) {
    const cat = `cc${RUN}${c}`;
    cats.push(cat);
    for (let i = 0; i < 60; i += 1) {
      // many products share prices on purpose, so the id tie-break is exercised
      await post('/products', { id: `bc${RUN}${c}x${i}`, name: 'Cat ' + i, category: cat, price: 100 * (i % 7), stock: 100000 });
    }
  }
  const flash = `bf${RUN}`;
  await post('/products', { id: flash, name: 'Flash', category: `cf${RUN}`, price: 2999, stock: 1000000 });
  return { hot, cats, flash };
}

async function main() {
  console.log('seeding...');
  const { hot, cats, flash } = await seed();
  const regular = hot;
  let seq = 0;
  const knownUsers = [];

  const setup = (req) => {
    const r = Math.random();
    if (r < 0.6) {
      // hot products get most of the reads
      const id = Math.random() < 0.7 ? hot[rnd(5)] : hot[rnd(hot.length)];
      return { ...req, method: 'GET', path: `/products/${id}` };
    }
    if (r < 0.75) {
      const cat = cats[rnd(cats.length)];
      const page = Math.random() < 0.8 ? 1 : 1 + rnd(10);
      const limit = [10, 20, 50][rnd(3)];
      return { ...req, method: 'GET', path: `/products?category=${cat}&page=${page}&limit=${limit}` };
    }
    if (r < 0.95) {
      const userId = `bu${RUN}${seq}`;
      seq += 1;
      if (knownUsers.length < 1000) knownUsers.push(userId);
      const productId = Math.random() < 0.7 ? flash : regular[rnd(regular.length)];
      return { ...req, method: 'POST', path: '/orders', headers: H, body: j({ userId, productId }) };
    }
    const u = knownUsers.length ? knownUsers[rnd(knownUsers.length)] : `bu${RUN}none`;
    return { ...req, method: 'GET', path: `/users/${u}/orders` };
  };

  console.log(`running ${SECS}s, ${CONNS} connections ...`);
  const res = await autocannon({
    url: BASE,
    connections: CONNS,
    duration: SECS,
    requests: [{ setupRequest: setup }],
  });

  const lat = res.latency;
  const rps = res.requests.average;
  const errors = res.errors + res.timeouts;
  const non2xx = res.non2xx;
  console.log(JSON.stringify({
    reqPerSec: Math.round(rps),
    p50ms: lat.p50,
    p99ms: lat.p99,
    maxms: lat.max,
    socketErrors: errors,
    non2xx,
    total: res.requests.total,
  }, null, 2));
  console.log('note: 409 responses are expected (sold out / already purchased) and are counted in non2xx.');
}

main().catch((e) => { console.error(e); process.exit(1); });
