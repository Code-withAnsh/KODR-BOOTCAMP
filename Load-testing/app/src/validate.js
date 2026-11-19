'use strict';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStr = (v, min, max) => typeof v === 'string' && v.length >= min && v.length <= max;
const isInt = (v) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;

// Product body: every field present, right type, in range.
function validProduct(b) {
  return isObj(b) && isStr(b.id, 1, 64) && isStr(b.name, 1, 200) && isStr(b.category, 1, 64) &&
    isInt(b.price) && isInt(b.stock);
}

// ?category=&page=&limit= from a raw query string. Repeated params are invalid.
// Returns { category, page, limit } or null.
function parseListQuery(qs) {
  const p = new URLSearchParams(qs);
  const cats = p.getAll('category');
  if (cats.length !== 1 || cats[0].length === 0) return null;
  let page = 1;
  let limit = 20;
  const pages = p.getAll('page');
  if (pages.length > 1) return null;
  if (pages.length === 1) {
    if (!/^\d{1,15}$/.test(pages[0])) return null;
    page = Number(pages[0]);
    if (page < 1) return null;
  }
  const limits = p.getAll('limit');
  if (limits.length > 1) return null;
  if (limits.length === 1) {
    if (!/^\d{1,10}$/.test(limits[0])) return null;
    limit = Number(limits[0]);
    if (limit < 1 || limit > 50) return null;
  }
  return { category: cats[0], page, limit };
}

module.exports = { isObj, isStr, isInt, validProduct, parseListQuery };
