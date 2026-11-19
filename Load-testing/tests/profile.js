const autocannon = require('autocannon');
const http = require('http');
const BASE = process.env.BASE || 'http://app:8080';
const U = new URL(BASE);
const agent = new http.Agent({ keepAlive: false });
const RUN = Math.random().toString(36).slice(2, 7);
const rnd = (n) => Math.floor(Math.random() * n);
function call(method, path, body) {
  return new Promise((res, rej) => {
    const d = body ? JSON.stringify(body) : null;
    const r = http.request({ agent, method, hostname: U.hostname, port: U.port, path, headers: d ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(d) } : {} }, (x) => { x.resume(); x.on('end', () => res(x.statusCode)); });
    r.on('error', rej); if (d) r.write(d); r.end();
  });
}
(async () => {
  const ids = [], cats = [];
  for (let c = 0; c < 5; c++) cats.push(`cp${RUN}${c}`);
  for (let i = 0; i < 300; i++) { const id = `pp${RUN}${i}`; ids.push(id); await call('POST', '/products', { id, name: 'n' + i, category: cats[i % 5], price: 100 * (1 + rnd(20)), stock: 1000000 }); }
  await call('POST', '/products', { id: `pf${RUN}`, name: 'flash', category: `cf${RUN}`, price: 2999, stock: 1000000 });
  let n = 0;
  const types = {
    'read (hot products)': () => ({ method: 'GET', path: `/products/${ids[rnd(20)]}` }),
    'list category': () => ({ method: 'GET', path: `/products?category=${cats[rnd(5)]}&page=${1 + rnd(3)}&limit=${[10, 20, 50][rnd(3)]}` }),
    'order on flash (1 hot product)': () => ({ method: 'POST', path: '/orders', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: `u${RUN}a${n++}`, productId: `pf${RUN}` }) }),
    'order on regular products': () => ({ method: 'POST', path: '/orders', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: `u${RUN}b${n++}`, productId: ids[rnd(ids.length)] }) }),
    'user orders (no orders)': () => ({ method: 'GET', path: `/users/nobody${RUN}${rnd(1e6)}/orders` }),
  };
  for (const [name, mk] of Object.entries(types)) {
    const r = await autocannon({ url: BASE, connections: 50, duration: 8, overallRate: 500, timeout: 2, requests: [{ setupRequest: (req) => ({ ...req, ...mk() }) }] });
    console.log(name.padEnd(34), 'rps', String(Math.round(r.requests.average)).padStart(4), ' p50', String(r.latency.p50).padStart(4), 'ms  p99', String(r.latency.p99).padStart(5), 'ms  max', String(r.latency.max).padStart(5), 'ms  non2xx', r.non2xx, 'err', r.errors + r.timeouts);
    await new Promise((x) => setTimeout(x, 1500));
  }
})();
