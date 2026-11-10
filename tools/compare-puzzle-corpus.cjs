#!/usr/bin/env node
'use strict';

// Compare two server-only simulator bundles against saved states without
// writing to the database or logging puzzle data. The web checkout supplies
// database credentials, its locked dependencies and the transport decoder.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');

async function main() {
  const [baselinePath, candidatePath, webArg] = process.argv.slice(2);
  if (!baselinePath || !candidatePath || process.argv.length > 5) {
    throw new Error('Usage: node tools/compare-puzzle-corpus.cjs <baseline.mjs> <candidate.mjs> [web-checkout]');
  }
  const web = fs.realpathSync(webArg || path.join(__dirname, '../../pokepuzzles-web'));
  const requireWeb = createRequire(path.join(web, 'package.json'));
  const envPath = path.join(web, '.env');
  const env = fs.existsSync(envPath) ? requireWeb('dotenv').parse(fs.readFileSync(envPath)) : {};
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || env.DIRECT_URL || env.DATABASE_URL;
  if (!databaseUrl) throw new Error('No database connection is configured');
  requireWeb('tsx/cjs/api').register();
  const { normalizeSimulatorValidationState } = require(path.join(web, 'lib/simulator-gzip.ts'));
  const { Client } = requireWeb('pg');
  const db = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: 12000,
    application_name: 'prizemap-readonly-upstream-compatibility' });
  const baseline = await import(pathToFileURL(path.resolve(baselinePath)).href);
  const candidate = await import(pathToFileURL(path.resolve(candidatePath)).href);
  const counter = () => ({ rows: 0, noFragment: 0, decodeFailure: 0, nonSimulator: 0, compared: 0,
    bothValid: 0, bothInvalid: 0, baselineOnlyValid: 0, candidateOnlyValid: 0,
    serializedChanged: 0, cardNamesChanged: 0, deserializedStateChanged: 0 });
  const summary = { all: counter(), active: counter() };
  const count = (active, key) => { summary.all[key]++; if (active) summary.active[key]++; };
  async function validate(engine, stateData) {
    const response = await engine.handle(new Request('https://simulator.internal/v1/game/validate-state', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stateData })
    }));
    return response.json();
  }
  try {
    await db.connect();
    await db.query('BEGIN READ ONLY');
    await db.query("SET LOCAL statement_timeout = '30s'");
    const puzzles = (await db.query('SELECT "webviewUrl" AS old, "newWebviewUrl" AS updated, "deleted" IS NULL AS active FROM "Puzzle"')).rows;
    const created = (await db.query('SELECT "boardUrl" AS board, "deleted" IS NULL AS active FROM "CreatedPuzzle"')).rows;
    await db.query('ROLLBACK');
    await db.end();
    const rows = [...puzzles.map(p => ({ url: p.updated || p.old, active: p.active })),
      ...created.map(p => ({ url: p.board, active: p.active }))];
    const originalLog = console.log;
    console.log = () => {}; // Some card initializers log card names.
    try {
      for (const { url, active } of rows) {
        count(active, 'rows');
        if (typeof url !== 'string' || !url.includes('#')) { count(active, 'noFragment'); continue; }
        let encoded, decoded;
        try {
          encoded = normalizeSimulatorValidationState(decodeURIComponent(url.slice(url.indexOf('#') + 1)));
          decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
        } catch { count(active, 'decodeFailure'); continue; }
        if (!Array.isArray(decoded) || !Array.isArray(decoded[1]?.cardNames)) { count(active, 'nonSimulator'); continue; }
        count(active, 'compared');
        const a = await validate(baseline, encoded), b = await validate(candidate, encoded);
        if (a.valid && b.valid) {
          count(active, 'bothValid');
          if (a.serializedState !== b.serializedState) {
            count(active, 'serializedChanged');
            const x = JSON.parse(Buffer.from(a.serializedState, 'base64').toString('utf8'));
            const y = JSON.parse(Buffer.from(b.serializedState, 'base64').toString('utf8'));
            if (JSON.stringify(x[1]?.cardNames) !== JSON.stringify(y[1]?.cardNames)) count(active, 'cardNamesChanged');
          }
          if (JSON.stringify(a.info?.state) !== JSON.stringify(b.info?.state)) count(active, 'deserializedStateChanged');
        } else if (a.valid) count(active, 'baselineOnlyValid');
        else if (b.valid) count(active, 'candidateOnlyValid');
        else count(active, 'bothInvalid');
      }
    } finally { console.log = originalLog; }
    console.log(JSON.stringify(summary, null, 2));
    if (!summary.all.compared || summary.all.baselineOnlyValid || summary.all.serializedChanged ||
      summary.all.cardNamesChanged || summary.all.deserializedStateChanged) process.exitCode = 1;
  } finally { await db.end().catch(() => {}); }
}

main().catch(error => {
  // Do not print driver error details: they can contain connection credentials.
  console.error(JSON.stringify({ error: error.code || error.name, message: 'Read-only puzzle comparison failed' }));
  process.exitCode = 1;
});
