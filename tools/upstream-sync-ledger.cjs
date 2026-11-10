#!/usr/bin/env node
'use strict';

// Keep an explicit per-commit ledger: a later reviewed commit must never imply
// that every earlier change was applied. Fetch upstream separately first.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const ledgerPath = path.join(root, 'docs/upstream-sync-ledger.json');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

function main() {
  const command = process.argv[2] || 'status';
  if (!['status', 'refresh'].includes(command)) throw new Error('Use status or refresh');
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  if (ledger.schema !== 1 || !/^[a-f0-9]{40}$/.test(ledger.baseUpstream)) throw new Error('Invalid upstream sync ledger');
  const tip = git('rev-parse', 'upstream/main');
  execFileSync('git', ['merge-base', '--is-ancestor', ledger.baseUpstream, tip], { cwd: root });
  const commits = git('log', '--reverse', '--format=%H%x09%ad%x09%s', '--date=short', `${ledger.baseUpstream}..${tip}`)
    .split('\n').filter(Boolean).map(line => {
      const [sha, date, ...subject] = line.split('\t');
      return { sha, date, subject: subject.join('\t') };
    });
  const known = new Set(ledger.commits.map(commit => commit.sha));
  const unseen = commits.filter(commit => !known.has(commit.sha));
  if (command === 'refresh' && (unseen.length || ledger.latestObservedUpstream !== tip)) {
    for (const entry of unseen) ledger.commits.push({ ...entry, status: 'unreviewed', notes: '' });
    ledger.latestObservedUpstream = tip;
    const temp = `${ledgerPath}.${process.pid}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(ledger, null, 2) + '\n');
    fs.renameSync(temp, ledgerPath);
  }
  const counts = {};
  for (const commit of ledger.commits) counts[commit.status] = (counts[commit.status] || 0) + 1;
  console.log(JSON.stringify({ base: ledger.baseUpstream, tip, recordedTip: ledger.latestObservedUpstream,
    recorded: ledger.commits.length, counts, unseen: unseen.map(({ sha, subject }) => ({ sha, subject })) }, null, 2));
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(`Upstream sync ledger: ${error.message}`); process.exitCode = 1; }
}
