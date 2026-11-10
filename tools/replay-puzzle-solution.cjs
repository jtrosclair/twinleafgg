#!/usr/bin/env node
'use strict';

// Replays only recorded legal actions against the exact published snapshot.
// Run the simulator preparation/build first to generate ptcg-server/browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { replay } = require('./puzzle-playthrough-core.cjs');

const file = process.argv[2] || path.join(__dirname, '.puzzle-playthrough/phantom-maze.solution.json');
const repeats = Number(process.argv[3] || 1);
if (!Number.isInteger(repeats) || repeats < 1) throw new Error('Repeat count must be a positive integer.');
const solution = JSON.parse(fs.readFileSync(file, 'utf8'));
let last;
for (let i = 0; i < repeats; i++) {
  const session = replay({ puzzle: { name: solution.name }, stateData: solution.stateData }, solution.trace);
  assert.equal(session.state.phase, 7, 'The game must reach FINISHED.');
  assert.equal(session.state.winner, 0, 'The human player must win.');
  assert.equal(session.sim.complete, true, 'The puzzle session must be complete.');
  last = session.summary();
}
console.log(JSON.stringify({ ok: true, name: solution.name, sourceUrl: solution.sourceUrl,
  snapshotSha256: crypto.createHash('sha256').update(solution.stateData).digest('hex'),
  replays: repeats, orderedSteps: solution.trace.length, terminal: last }, null, 2));
