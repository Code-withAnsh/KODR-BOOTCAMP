'use strict';

// All configuration comes from environment variables (docker-compose loads .env).
function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`missing required env var ${name} (set it in .env)`);
  return v;
}

module.exports = {
  port: Number(process.env.PORT || 8080),
  host: '0.0.0.0', // the event requires 0.0.0.0:8080
  mongoUrl: required('MONGO_URL'),
  mongoRsHost: required('MONGO_RS_HOST'),
  // v2 uses its own database so it never mixes with v1 data.
  dbName: process.env.MONGO_DB || 'shopv2',
  mongoPoolSize: Number(process.env.MONGO_POOL_SIZE || 20),
  orderMaxInflight: Number(process.env.ORDER_MAX_INFLIGHT || 6),
  bodyLimit: 16 * 1024,
};
