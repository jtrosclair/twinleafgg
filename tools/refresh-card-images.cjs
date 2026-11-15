#!/usr/bin/env node
'use strict';

// Maintainer sync only. Gameplay uses the committed index and static CDN files.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = 'https://amydev.me/twinleaf-json/image-jsons/limitlesstcg/large.json';
const origin = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com';

function validateMap(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).length < 10000) {
    throw new Error('Image index is incomplete');
  }
  for (const [key, url] of Object.entries(value)) {
    let parsed; try { parsed = new URL(url); } catch { throw new Error(`Invalid indexed image: ${key}`); }
    const allowed = parsed.origin === origin && /^\/(?:tpci|tpc)\/[A-Za-z0-9_./-]+\.png$/.test(parsed.pathname)
      || parsed.origin === 'https://images.pokemontcg.io' && /^\/[A-Za-z0-9_!/-]+\.png$/.test(parsed.pathname);
    if (!key || typeof url !== 'string' || !allowed || parsed.search || parsed.hash
      || parsed.username || parsed.password) throw new Error(`Invalid indexed image: ${key}`);
  }
  return value;
}

// A Japanese collector number is not interchangeable with an English one.
// Full set pages provide the same verified JP print links as individual pages.
function japanesePrints(html, imageMap) {
  const entries = {};
  for (const block of html.split('<div class="card-page-main">').slice(1)) {
    const english = block.match(/data-src="(https:\/\/limitlesstcg\.nyc3\.cdn\.digitaloceanspaces\.com\/tpci\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+_EN\.png)"/);
    if (!english) continue;
    const counterparts = [...block.matchAll(/href="\/cards\/jp\/([A-Za-z0-9_-]+)\/(\d+[A-Za-z]?)"/g)];
    const jp = counterparts.map(match => imageMap[`${match[1]} ${match[2]}`])
      .find(url => typeof url === 'string' && url.startsWith(origin + '/tpc/'));
    // First listed print is an equivalent Japanese printing, not a guessed
    // suffix substitution. Some international exclusives have no JP version.
    entries[english[1].slice(origin.length)] = jp ? jp.slice(origin.length) : '';
  }
  if (!Object.keys(entries).length) throw new Error('Set page has no recognized card print listings');
  return entries;
}

async function refresh({ workspace = root, fetcher = fetch, log = console.log, all = false } = {}) {
  const indexFile = path.join(workspace, 'ptcg-server/data/limitlesstcg-images.json');
  const jpFile = path.join(workspace, 'ptcg-server/data/japanese-card-images.json');
  const previous = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const jp = fs.existsSync(jpFile) ? JSON.parse(fs.readFileSync(jpFile, 'utf8')) : {};
  const response = await fetcher(source, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Image index HTTP ${response.status}`);
  // Merge instead of replacing: retained legacy printing aliases must survive
  // an upstream omission. A failed refresh never writes a partial index.
  const incoming = validateMap(await response.json());
  const merged = { ...previous, ...incoming };
  const sets = new Map();
  for (const url of Object.values(merged)) {
    const match = url.match(/\/tpci\/([A-Za-z0-9_-]+)\/[^/]+_EN\.png$/);
    if (match && (all || !Object.hasOwn(jp, url.slice(origin.length)))) {
      if (!sets.has(match[1])) sets.set(match[1], []);
      sets.get(match[1]).push(url.slice(origin.length));
    }
  }
  const queue = [...sets]; let next = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (next < queue.length) {
      const [set, references] = queue[next++];
      const page = await fetcher(`https://limitlesstcg.com/cards/${set}?display=full`, { signal: AbortSignal.timeout(30000) });
      if (page.status === 404) { for (const ref of references) jp[ref] = ''; continue; }
      if (!page.ok) throw new Error(`${set} print listings HTTP ${page.status}`);
      const prints = japanesePrints(await page.text(), merged);
      for (const [ref, japanese] of Object.entries(prints)) {
        // Other-print previews can appear on a set page. They must not
        // overwrite that other set's own verified counterpart selection.
        if (ref.startsWith(`/tpci/${set}/`)) jp[ref] = japanese;
      }
      for (const ref of references) if (!Object.hasOwn(jp, ref)) jp[ref] = '';
      log(`Refreshed ${set} Japanese print references`);
    }
  }));
  const write = (file, value) => {
    const text = JSON.stringify(value, null, 2) + '\n';
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text) return;
    const temp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temp, text); fs.renameSync(temp, file);
  };
  write(indexFile, merged);
  write(jpFile, Object.fromEntries(Object.entries(jp).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)));
  const result = { images: Object.keys(merged).length,
    added: Object.keys(merged).filter(key => !Object.hasOwn(previous, key)).length,
    japanesePrints: Object.values(jp).filter(Boolean).length, setsRefreshed: sets.size };
  log(JSON.stringify(result)); return result;
}
if (require.main === module) refresh({ all: process.argv.includes('--all') }).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { refresh, validateMap, japanesePrints };
