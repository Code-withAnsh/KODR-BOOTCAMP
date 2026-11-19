'use strict';

// v2 entry point: plain Node http (no framework) on 0.0.0.0:8080.
// Starts listening right away (/health says "starting"), then loads MongoDB into memory.

const http = require('http');
const config = require('./config');
const store = require('./store');
const { isObj, isStr, validProduct, parseListQuery } = require('./validate');

const JSON_TYPE = 'application/json; charset=utf-8';

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': JSON_TYPE, 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}
const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj));
const BAD = JSON.stringify({ error: 'VALIDATION_ERROR' });
const badRequest = (res) => send(res, 400, BAD);

// Reads a JSON body. Resolves the parsed value, or undefined for a bad/oversized body.
function readJson(req) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    let tooBig = false;
    req.on('data', (c) => {
      size += c.length;
      if (size > config.bodyLimit) { tooBig = true; return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (tooBig) return resolve(undefined);
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch (e) { resolve(undefined); }
    });
    req.on('error', () => resolve(undefined));
  });
}

function decode(raw) {
  try { return decodeURIComponent(raw); } catch (e) { return undefined; }
}

// The JSON of a product is built once and reused until its stock changes (store.js clears p.json).
const productJson = (p) => p.json || (p.json = JSON.stringify({ id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock }));

// ---------- handlers ----------

async function createProduct(req, res) {
  const b = await readJson(req);
  if (!validProduct(b)) return badRequest(res);
  const r = await store.createProduct(b);
  if (r === 'exists') return sendJson(res, 409, { error: 'PRODUCT_EXISTS' });
  return sendJson(res, 201, { id: b.id, name: b.name, category: b.category, price: b.price, stock: b.stock });
}

function getProduct(res, raw) {
  const id = decode(raw);
  if (id === undefined) return badRequest(res);
  const p = store.getProduct(id);
  if (!p) return sendJson(res, 404, { error: 'PRODUCT_NOT_FOUND' });
  return send(res, 200, productJson(p));
}

function listProducts(res, qs) {
  const q = parseListQuery(qs);
  if (!q) return badRequest(res);
  const { items, total } = store.listCategory(q.category, q.page, q.limit);
  const body = '{"items":[' + items.map(productJson).join(',') + `],"page":${q.page},"limit":${q.limit},"total":${total}}`;
  return send(res, 200, body);
}

async function createOrder(req, res) {
  const b = await readJson(req);
  // 400 -> 404 -> 409
  if (!isObj(b) || !isStr(b.userId, 1, 100000) || !isStr(b.productId, 1, 100000)) return badRequest(res);
  const d = store.decideOrder(b.userId, b.productId);
  if (d.error) return sendJson(res, d.status, { error: d.error });
  const op = d.reserve;
  const committed = await store.commitOrder(op);
  if (!committed) return sendJson(res, 500, { error: 'INTERNAL_ERROR' });
  return sendJson(res, 201, { orderId: op.orderId, userId: op.userId, productId: op.productId });
}

function userOrders(res, raw) {
  const userId = decode(raw);
  if (userId === undefined) return badRequest(res);
  return sendJson(res, 200, { userId, orders: store.getUserOrders(userId) });
}

// ---------- router ----------

async function handle(req, res) {
  const url = req.url;
  const q = url.indexOf('?');
  let path = q === -1 ? url : url.slice(0, q);
  const qs = q === -1 ? '' : url.slice(q + 1);
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  const m = req.method;

  if (path === '/health' && m === 'GET') {
    return store.state.ready ? send(res, 200, '{"status":"ok"}') : send(res, 503, '{"status":"starting"}');
  }
  if (!store.state.ready) return send(res, 503, '{"status":"starting"}');

  if (path === '/products') {
    if (m === 'GET') return listProducts(res, qs);
    if (m === 'POST') return createProduct(req, res);
  } else if (path.startsWith('/products/')) {
    const raw = path.slice(10);
    if (m === 'GET' && raw.length > 0 && raw.indexOf('/') === -1) return getProduct(res, raw);
  } else if (path === '/orders') {
    if (m === 'POST') return createOrder(req, res);
  } else if (path.startsWith('/users/') && path.endsWith('/orders')) {
    const raw = path.slice(7, -7);
    if (m === 'GET' && raw.length > 0 && raw.indexOf('/') === -1) return userOrders(res, raw);
  }
  return sendJson(res, 404, { error: 'NOT_FOUND' });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.log('error:', err && err.message);
    if (!res.headersSent) sendJson(res, 500, { error: 'INTERNAL_ERROR' });
  });
});

// Keep-alive friendly: the load generator reuses connections.
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;
server.requestTimeout = 0;

process.on('unhandledRejection', (err) => console.log('unhandledRejection:', err && err.message));

server.listen(config.port, config.host, () => console.log(`listening on ${config.host}:${config.port}`));

store.init().catch((err) => {
  console.log('init failed:', err && err.message);
  process.exit(1); // Docker restarts us
});
