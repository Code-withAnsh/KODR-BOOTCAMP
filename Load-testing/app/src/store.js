'use strict';

// v2 store.
//
// Source of truth on disk: MongoDB (products + orders), written in batches inside transactions.
// Serving copy: memory. Every answer comes from memory, which always equals
//   "what is committed in MongoDB" + "orders reserved but whose batch is still being committed".
//
// Why it is safe:
//  - Node runs this file on ONE thread. The order decision (product exists? already bought?
//    stock > 0? -> take one unit, mark bought) is fully synchronous, so two requests can never
//    interleave inside it. No oversell, no double purchase, no lock needed.
//  - A 201 is sent only AFTER the batch containing that order is committed (journaled) in MongoDB.
//    So every 201 is on disk (no lost orders). If the server dies before the commit, the client
//    never got a 201, and the reserved unit simply never reached the DB (stock and orders agree).
//  - Stock is DERIVED: stock = initialStock - (number of orders stored for that product).
//    The orders collection is the single source of truth, so stock and orders can never disagree,
//    even if the process dies at any moment. (No stock counter to keep in sync, so no hot document
//    and no transaction: several batches can be written at the same time.)
//  - On startup memory is rebuilt from MongoDB (products + orders).

const { MongoClient } = require('mongodb');
const config = require('./config');

const state = {
  ready: false,
  client: null,
  products: null, // collection
  orders: null,   // collection
};

const products = new Map();   // id -> { id, name, category, price, stock }
const categories = new Map(); // category -> array of product objects sorted by (price, id)
const userOrders = new Map(); // userId -> [{ orderId, productId }]  (committed orders only)
const purchased = new Set();  // key(userId, productId) for committed AND in-flight orders

const keyOf = (userId, productId) => `${userId.length}:${userId}${productId}`;
const bootId = Math.random().toString(36).slice(2, 8);
let orderSeq = 0;
const newOrderId = () => `o_${bootId}${(orderSeq++).toString(36)}`;

function cmp(a, b) {
  if (a.price !== b.price) return a.price - b.price;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function addToCategory(p) {
  let arr = categories.get(p.category);
  if (!arr) { arr = []; categories.set(p.category, arr); }
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cmp(arr[mid], p) < 0) lo = mid + 1; else hi = mid;
  }
  arr.splice(lo, 0, p);
}

function addUserOrder(userId, orderId, productId) {
  let list = userOrders.get(userId);
  if (!list) { list = []; userOrders.set(userId, list); }
  list.push({ orderId, productId });
}

// ---------- startup ----------

async function ensureReplicaSet(admin) {
  try {
    await admin.command({ replSetGetStatus: 1 });
  } catch (err) {
    if (err.codeName !== 'NotYetInitialized') throw err;
    await admin.command({ replSetInitiate: { _id: 'rs0', members: [{ _id: 0, host: config.mongoRsHost }] } });
    console.log('replica set rs0 initiated');
  }
}

async function connect() {
  for (;;) {
    let client = null;
    try {
      client = new MongoClient(config.mongoUrl, {
        serverSelectionTimeoutMS: 2000,
        maxPoolSize: config.mongoPoolSize,
      });
      await client.connect();
      const admin = client.db('admin');
      await ensureReplicaSet(admin);
      const hello = await admin.command({ hello: 1 });
      if (!hello.isWritablePrimary) throw new Error('not primary yet');
      const db = client.db(config.dbName);
      state.client = client;
      state.products = db.collection('products');
      state.orders = db.collection('orders');
      // Safety net: the DB itself also refuses a second order for the same (user, product).
      await state.orders.createIndex({ userId: 1, productId: 1 }, { unique: true });
      return;
    } catch (err) {
      console.log('mongo not ready, retrying:', err.message);
      if (client) client.close().catch(() => {});
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

async function load() {
  let np = 0;
  for await (const d of state.products.find({})) {
    const initial = d.initialStock !== undefined ? d.initialStock : d.stock;
    const p = { id: d._id, name: d.name, category: d.category, price: d.price, stock: initial, json: null };
    products.set(p.id, p);
    addToCategory(p);
    np += 1;
  }
  let no = 0;
  for await (const o of state.orders.find({}, { projection: { userId: 1, productId: 1 } })) {
    addUserOrder(o.userId, o._id, o.productId);
    purchased.add(keyOf(o.userId, o.productId));
    const p = products.get(o.productId);
    if (p) p.stock -= 1; // stock = initialStock - orders
    no += 1;
  }
  console.log(`loaded ${np} products, ${no} orders`);
}

async function init() {
  await connect();
  await load();
  state.ready = true;
  console.log('ready');
}

// ---------- products ----------

// Returns 'created' or 'exists'. Memory is updated only after MongoDB has the product.
async function createProduct(b) {
  if (products.has(b.id)) return 'exists';
  try {
    await state.products.insertOne({ _id: b.id, name: b.name, category: b.category, price: b.price, initialStock: b.stock });
  } catch (err) {
    if (err.code === 11000) return 'exists';
    throw err;
  }
  if (products.has(b.id)) return 'exists';
  const p = { id: b.id, name: b.name, category: b.category, price: b.price, stock: b.stock, json: null };
  products.set(p.id, p);
  addToCategory(p);
  return 'created';
}

const getProduct = (id) => products.get(id);

function listCategory(category, page, limit) {
  const arr = categories.get(category);
  if (!arr) return { items: [], total: 0 };
  const from = (page - 1) * limit;
  return { items: from >= arr.length ? [] : arr.slice(from, from + limit), total: arr.length };
}

const getUserOrders = (userId) => userOrders.get(userId) || [];

// ---------- orders ----------

// Synchronous decision. Returns { status, error } or { reserve } (a pending order).
function decideOrder(userId, productId) {
  const p = products.get(productId);
  if (!p) return { status: 404, error: 'PRODUCT_NOT_FOUND' };
  const k = keyOf(userId, productId);
  if (purchased.has(k)) return { status: 409, error: 'ALREADY_PURCHASED' };
  if (p.stock <= 0) return { status: 409, error: 'SOLD_OUT' };
  // Reserve: take the unit and mark the purchase in the same synchronous step.
  p.stock -= 1;
  p.json = null; // stock changed: cached JSON is stale
  purchased.add(k);
  return { reserve: { orderId: newOrderId(), userId, productId, key: k, product: p } };
}

// Undo a reservation whose batch did not commit.
function release(op) {
  op.product.stock += 1;
  op.product.json = null;
  purchased.delete(op.key);
}

// ---------- batch writer (group commit) ----------
// Orders reserved in the same tick are written together with ONE insertMany (journaled before it
// returns). Up to MAX_INFLIGHT batches are written at the same time, so one slow disk flush does
// not hold every other order back.

const MAX_INFLIGHT = config.orderMaxInflight;
let queue = [];
let inflight = 0;
let pumpScheduled = false;

// Resolves true when the order is committed, false when it was rolled back.
function commitOrder(op) {
  return new Promise((resolve) => {
    op.resolve = resolve;
    queue.push(op);
    if (!pumpScheduled) { pumpScheduled = true; setImmediate(pump); }
  });
}

function pump() {
  pumpScheduled = false;
  while (inflight < MAX_INFLIGHT && queue.length > 0) {
    const batch = queue;
    queue = [];
    inflight += 1;
    runBatch(batch).finally(() => {
      inflight -= 1;
      if (queue.length > 0 && !pumpScheduled) { pumpScheduled = true; setImmediate(pump); }
    });
  }
}

async function runBatch(batch) {
  const docs = batch.map((op) => ({ _id: op.orderId, userId: op.userId, productId: op.productId }));
  try {
    await state.orders.insertMany(docs, { ordered: false });
    for (const op of batch) { addUserOrder(op.userId, op.orderId, op.productId); op.resolve(true); }
    return;
  } catch (err) {
    console.log('batch insert failed:', err.message);
  }
  // Some of the orders may have been stored. Ask the DB which ones, then answer each order truthfully.
  try {
    const ids = batch.map((op) => op.orderId);
    const found = new Set((await state.orders.find({ _id: { $in: ids } }, { projection: { _id: 1 } }).toArray()).map((d) => d._id));
    for (const op of batch) {
      if (found.has(op.orderId)) { addUserOrder(op.userId, op.orderId, op.productId); op.resolve(true); }
      else { release(op); op.resolve(false); }
    }
  } catch (err2) {
    // Cannot tell what is on disk. Memory may disagree with the DB: restart, Docker brings us back
    // and memory is rebuilt from MongoDB.
    console.log('cannot verify batch, restarting to resync:', err2.message);
    process.exit(1);
  }
}

module.exports = {
  state, init, createProduct, getProduct, listCategory, getUserOrders, decideOrder, commitOrder,
};
