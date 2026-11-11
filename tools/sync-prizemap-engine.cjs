#!/usr/bin/env node
// Prepare before publishing the simulator, then publish the validated server bundle.
// Never stages or commits files in either of the user's existing checkouts.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const generated = ['lib/simulator-engine/service.mjs', 'lib/simulator-engine/source-snapshot.json.gz', 'lib/simulator-engine/provenance.json', 'lib/data/simulator-card-art.json'];
const legacyArtworkAliases = {
  'Drillbur SV11B': 'Drilbur BLK 45',
  'DrillburAR SV11B': 'DrilburAR BLK 124',
};
const expectedRemote = /^(https:\/\/github\.com\/jtrosclair\/pokepuzzles-web(?:\.git)?|git@github\.com:jtrosclair\/pokepuzzles-web(?:\.git)?|ssh:\/\/git@github\.com\/jtrosclair\/pokepuzzles-web(?:\.git)?)$/i;
const sha = data => crypto.createHash('sha256').update(data).digest('hex');

function command(cmd, args, cwd, opts = {}) {
  const out = spawnSync(cmd, args, { cwd, encoding: 'utf8', stdio: opts.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', env: { ...process.env, NODE_TEST_CONTEXT: undefined, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH, GIT_TERMINAL_PROMPT: '0' } });
  if (out.error || out.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed${out.status === null ? '' : ` (exit ${out.status})`}${out.stderr ? `: ${out.stderr.trim()}` : ''}`);
  return out.stdout?.trim();
}
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function readManifest(dir) { return readJson(path.join(dir, 'lib/simulator-engine/provenance.json')); }
function checkFiles(dir, metadata) {
  for (const [name, hash, length] of [['service.mjs', metadata.bundleSha256, metadata.bundleBytes], ['source-snapshot.json.gz', metadata.sourceSnapshotSha256, metadata.sourceSnapshotBytes]]) {
    const bytes = fs.readFileSync(path.join(dir, 'lib/simulator-engine', name));
    if (sha(bytes) !== hash || bytes.length !== length) throw new Error(`${name} does not match its provenance`);
  }
}
// The simulator package/build ID changes for unrelated UI releases. Only the
// engine bytes and its exact input snapshot determine if a web release is needed.
function sameEngine(a, b) { return a.bundleSha256 === b.bundleSha256 && a.sourceSnapshotSha256 === b.sourceSnapshotSha256; }
function sameRelease(a, b, oldArt, newArt) { return sameEngine(a, b) && oldArt === newArt; }
function verifyRemote(remote) { if (!expectedRemote.test(remote)) throw new Error('PrizeMap web origin is not the expected jtrosclair/pokepuzzles-web repository'); }
function preserveLegacyArtworkAliases(repo) {
  const file = path.join(repo, 'scripts/refresh-simulator-card-art.cjs');
  const source = fs.readFileSync(file, 'utf8');
  const marker = '    validateCoverage(read(target), read(temporary), imageMap);';
  if (!source.includes(marker)) throw new Error('PrizeMap artwork refresh script has an unexpected shape');
  const replacement = `    const previous = read(target);\n    const extracted = read(temporary);\n    // Preserve old fullName artwork aliases when their exact image references\n    // are still in the current simulator image index. This keeps existing\n    // puzzle art stable when upstream changes a card's set/collector metadata.\n    for (const [legacy, artwork] of Object.entries(previous)) {\n      const references = [artwork[1], artwork[4]].filter(Boolean);\n      if (!extracted[legacy] && references.length && references.every(reference => imageMap[reference])) {\n        extracted[legacy] = artwork;\n      }\n    }\n    for (const [legacy, current] of Object.entries(${JSON.stringify(legacyArtworkAliases)})) {\n      if (!extracted[legacy] && previous[legacy] && extracted[current]) extracted[legacy] = previous[legacy];\n    }\n    fs.writeFileSync(temporary, JSON.stringify(Object.fromEntries(Object.entries(extracted).sort())) + '\\n');\n    validateCoverage(previous, read(temporary), imageMap);`;
  fs.writeFileSync(file, source.replace(marker, replacement));
}
function currentRemoteHead(repo) {
  const out = command('git', ['ls-remote', '--exit-code', 'origin', 'refs/heads/main'], repo, { capture: true });
  const match = /^([0-9a-f]{40})\s+refs\/heads\/main$/m.exec(out);
  if (!match) throw new Error('Could not resolve exactly one PrizeMap main branch');
  return match[1];
}
function assertRemoteAt(repo, expected) {
  const actual = currentRemoteHead(repo);
  if (actual !== expected) throw new Error(`PrizeMap main changed from ${expected} to ${actual}; prepare again against the latest main. No force push was attempted.`);
}
function attest(source) {
  const r = command(process.execPath, [path.join(source, 'ptcg-play/scripts/build-attestation.cjs'), 'verify'], source, { capture: true });
  // The verifier prints JSON, and failure propagates through command().
  return JSON.parse(r);
}
function prepare({ stage, web, source = root }) {
  if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Use Node.js 24 to sync the simulator engine');
  stage = path.resolve(stage); web = fs.realpathSync(web); source = fs.realpathSync(source);
  if (fs.existsSync(stage) && fs.readdirSync(stage).length) throw new Error('Stage directory must be empty');
  fs.mkdirSync(stage, { recursive: true, mode: 0o700 });
  const remote = command('git', ['config', '--get', 'remote.origin.url'], web, { capture: true });
  verifyRemote(remote);
  // Do not depend on the dirty web checkout, its current branch or its dependencies.
  const repo = path.join(stage, 'web');
  console.log('Cloning current PrizeMap main into an isolated staging directory.');
  command('git', ['clone', '--no-checkout', '--single-branch', '--branch', 'main', '--filter=blob:none', remote, repo], stage);
  command('git', ['checkout', '--detach', 'origin/main'], repo);
  const base = command('git', ['rev-parse', 'HEAD'], repo, { capture: true });
  const before = readManifest(repo);
  checkFiles(repo, before);
  const cataloguePath = path.join(repo, 'lib/data/simulator-card-art.json');
  const previousArtwork = sha(fs.readFileSync(cataloguePath));
  console.log('Installing PrizeMap dependencies from its lockfile.');
  command('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], repo);
  command(process.execPath, ['lib/simulator-engine/generate.cjs', source], repo);
  preserveLegacyArtworkAliases(repo);
  command(process.execPath, ['scripts/refresh-simulator-card-art.cjs', source], repo);
  const after = readManifest(repo);
  checkFiles(repo, after);
  command(process.execPath, ['lib/simulator-engine/verify.cjs'], repo);
  command(process.execPath, ['--test', 'lib/simulator-engine/engine.test.mjs', 'tests/simulator-gzip-validation.test.cjs', 'tests/simulator-card-art.test.cjs', 'tests/simulator-version.test.cjs'], repo);
  const artworkSha256 = sha(fs.readFileSync(cataloguePath));
  const changed = !sameRelease(before, after, previousArtwork, artworkSha256);
  let commit = base;
  if (changed) {
    // The author must be an actual Git/Vercel-linked user for Vercel's Git
    // integration to deploy the commit; do not invent a bot identity.
    const authorName = command('git', ['config', '--get', 'user.name'], web, { capture: true });
    const authorEmail = command('git', ['config', '--get', 'user.email'], web, { capture: true });
    if (!authorName || !authorEmail || /[\r\n]/.test(authorName + authorEmail)) throw new Error('Configure a valid Git user.name and user.email for the PrizeMap checkout');
    command('git', ['add', '--', ...generated], repo);
    command('git', ['-c', `user.name=${authorName}`, '-c', `user.email=${authorEmail}`, 'commit', '-m', 'chore: sync puzzle engine with simulator'], repo);
    commit = command('git', ['rev-parse', 'HEAD'], repo, { capture: true });
    const paths = command('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', commit], repo, { capture: true }).split('\n').filter(Boolean).sort();
    if (paths.some(p => !generated.includes(p))) throw new Error('Unexpected files in prepared release commit');
  } else {
    console.log('Engine, source inputs, and artwork are unchanged; no web commit is needed.');
  }
  const metadata = { schema: 1, source, repo, remote, base, commit, changed, bundleSha256: after.bundleSha256, snapshotSha256: after.sourceSnapshotSha256, artworkSha256, simulatorPackageHash: after.simulatorBuild.packageHash };
  fs.writeFileSync(path.join(stage, 'sync.json'), JSON.stringify(metadata, null, 2) + '\n', { mode: 0o600 });
  console.log(`Prepared simulator synchronization in ${stage}.`);
  return metadata;
}
async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000), headers: { 'cache-control': 'no-cache' } });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}
async function ensureLiveManifest(metadata, fetcher = fetchJson) {
  const live = await fetcher('https://sim-static.prizemap.app/simulator-manifest.json');
  if (live.packageHash !== metadata.simulatorPackageHash) throw new Error(`Live simulator package ${live.packageHash} does not match prepared package ${metadata.simulatorPackageHash}; do not publish a stale engine.`);
}
async function publish({ stage }, deps = {}) {
  stage = path.resolve(stage);
  const metadata = readJson(path.join(stage, 'sync.json'));
  const repo = path.join(stage, 'web');
  if (metadata.schema !== 1 || metadata.repo !== repo) throw new Error('Invalid simulator synchronization stage');
  verifyRemote(metadata.remote);
  const actualRemote = command('git', ['config', '--get', 'remote.origin.url'], repo, { capture: true });
  if (actualRemote !== metadata.remote) throw new Error('Stage remote changed after preparation');
  const head = command('git', ['rev-parse', 'HEAD'], repo, { capture: true });
  if (head !== metadata.commit) throw new Error('Prepared release commit changed');
  const prepared = readManifest(repo);
  checkFiles(repo, prepared);
  if (sha(fs.readFileSync(path.join(repo, 'lib/data/simulator-card-art.json'))) !== metadata.artworkSha256) throw new Error('Prepared artwork catalogue changed');
  if (prepared.bundleSha256 !== metadata.bundleSha256 || prepared.sourceSnapshotSha256 !== metadata.snapshotSha256 || prepared.simulatorBuild.packageHash !== metadata.simulatorPackageHash) throw new Error('Prepared provenance changed');
  const currentBuild = attest(metadata.source);
  if (currentBuild.inputHash !== prepared.simulatorBuild.inputHash || currentBuild.packageHash !== metadata.simulatorPackageHash) throw new Error('Simulator source or build changed after preparation; prepare again.');
  // A failed publish can be retried: allow the exact already-pushed commit.
  const remoteHead = currentRemoteHead(repo);
  if (remoteHead !== metadata.base && remoteHead !== metadata.commit) throw new Error('PrizeMap main changed since preparation; prepare again. No force push was attempted.');
  await ensureLiveManifest(metadata, deps.fetchJson);
  if (metadata.changed && remoteHead === metadata.base) {
    // A normal fast-forward push rejects a concurrent main update. Never force.
    assertRemoteAt(repo, metadata.base);
    await ensureLiveManifest(metadata, deps.fetchJson);
    command('git', ['push', 'origin', 'HEAD:refs/heads/main'], repo);
    console.log(`Published PrizeMap commit ${metadata.commit}; waiting for Vercel.`);
  }
  const timeoutMs = deps.timeoutMs ?? 15 * 60 * 1000;
  const delayMs = deps.delayMs ?? 5000;
  const now = deps.now || Date.now;
  const sleep = deps.sleep || (ms => new Promise(resolve => setTimeout(resolve, ms)));
  const started = now();
  let lastError;
  do {
    await ensureLiveManifest(metadata, deps.fetchJson);
    try {
      const deployed = await (deps.fetchJson || fetchJson)('https://www.prizemap.app/api/simulator-version');
      if (deployed.bundleSha256 === metadata.bundleSha256 &&
          deployed.sourceSnapshotSha256 === metadata.snapshotSha256 &&
          deployed.artworkCatalogueSha256 === metadata.artworkSha256 &&
          (!metadata.changed || deployed.simulatorPackageHash === metadata.simulatorPackageHash)) {
        console.log(`Live PrizeMap engine matches ${metadata.bundleSha256}.`);
        return metadata;
      }
      lastError = `live engine or snapshot does not yet match the prepared release`;
    } catch (error) { lastError = error.message; }
    if (now() - started >= timeoutMs) break;
    await sleep(delayMs);
  } while (true);
  throw new Error(`Timed out waiting for the live PrizeMap engine (${lastError}). Retry publish using the same stage; the web commit may already have been pushed.`);
}
function parseArgs(args) {
  const action = args.shift();
  if (!['prepare', 'publish'].includes(action)) throw new Error('Usage: sync-prizemap-engine.cjs prepare|publish --stage <dir> [--web <PrizeMap checkout>]');
  const options = {};
  while (args.length) {
    const flag = args.shift();
    if (!['--stage', '--web'].includes(flag) || !args.length || args[0].startsWith('--')) throw new Error(`Invalid argument: ${flag}`);
    const key = flag.slice(2);
    if (options[key]) throw new Error(`Duplicate argument: ${flag}`);
    options[key] = args.shift();
  }
  if (!options.stage) throw new Error('--stage is required');
  if (action === 'publish' && options.web) throw new Error('--web is only used for prepare');
  options.web ||= path.resolve(root, '../pokepuzzles-web');
  return { action, options };
}
if (require.main === module) {
  (async () => { const { action, options } = parseArgs(process.argv.slice(2)); await (action === 'prepare' ? prepare(options) : publish(options)); })().catch(error => { console.error(`Simulator synchronization failed: ${error.message}`); process.exitCode = 1; });
}
module.exports = { sameEngine, sameRelease, checkFiles, verifyRemote, parseArgs, ensureLiveManifest, prepare, publish, preserveLegacyArtworkAliases };
