const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { sameEngine, sameRelease, checkFiles, verifyRemote, parseArgs, ensureLiveManifest, publish } = require('./sync-prizemap-engine.cjs');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');

test('identical engine and input snapshot skip redundant releases despite build ID changes', () => {
  const old = {bundleSha256:'a',sourceSnapshotSha256:'b',simulatorBuild:{buildId:'old',packageHash:'old'}};
  const rebuilt = {bundleSha256:'a',sourceSnapshotSha256:'b',simulatorBuild:{buildId:'new',packageHash:'new'}};
  assert.equal(sameEngine(old,rebuilt),true);
  assert.equal(sameEngine(old,{...rebuilt,bundleSha256:'different'}),false);
  assert.equal(sameEngine(old,{...rebuilt,sourceSnapshotSha256:'different'}),false);
  assert.equal(sameRelease(old,rebuilt,'same-art','same-art'),true);
  assert.equal(sameRelease(old,rebuilt,'old-art','new-art'),false);
});

test('bundle and snapshot hashes and lengths must match provenance', t => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sim-sync-test-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const engine=path.join(dir,'lib/simulator-engine');fs.mkdirSync(engine,{recursive:true});
  fs.writeFileSync(path.join(engine,'service.mjs'),'engine');fs.writeFileSync(path.join(engine,'source-snapshot.json.gz'),'snapshot');
  const meta={bundleSha256:hash('engine'),bundleBytes:6,sourceSnapshotSha256:hash('snapshot'),sourceSnapshotBytes:8};
  assert.doesNotThrow(()=>checkFiles(dir,meta));
  fs.writeFileSync(path.join(engine,'service.mjs'),'tamper');
  assert.throws(()=>checkFiles(dir,meta),/service.mjs does not match/);
  fs.writeFileSync(path.join(engine,'service.mjs'),'engine');
  assert.throws(()=>checkFiles(dir,{...meta,sourceSnapshotBytes:9}),/source-snapshot.json.gz does not match/);
});

test('only the configured PrizeMap repository is accepted as an origin', () => {
  for(const url of ['https://github.com/jtrosclair/pokepuzzles-web.git','git@github.com:jtrosclair/pokepuzzles-web.git']) assert.doesNotThrow(()=>verifyRemote(url));
  for(const url of ['https://github.com/other/pokepuzzles-web.git','https://github.com/jtrosclair/pokepuzzles-web.git.evil','/tmp/repo']) assert.throws(()=>verifyRemote(url),/expected/);
});

test('the deployed simulator package must match the prepared release', async () => {
  await ensureLiveManifest({simulatorPackageHash:'matching'},async()=>({packageHash:'matching'}));
  await assert.rejects(ensureLiveManifest({simulatorPackageHash:'matching'},async()=>({packageHash:'newer'})),/do not publish a stale engine/);
});

test('commands require a stage and reject ambiguous arguments', () => {
  assert.throws(()=>parseArgs(['prepare']),/stage/);
  assert.throws(()=>parseArgs(['publish','--stage','x','--web','y']),/only used/);
  assert.throws(()=>parseArgs(['prepare','--stage','x','--stage','y']),/Duplicate/);
  assert.deepEqual(parseArgs(['prepare','--stage','x','--web','y']),{action:'prepare',options:{stage:'x',web:'y'}});
});

test('publishing rejects a stage whose metadata points elsewhere', async t => {
  const stage=fs.mkdtempSync(path.join(os.tmpdir(),'sim-sync-stage-'));t.after(()=>fs.rmSync(stage,{recursive:true,force:true}));
  fs.writeFileSync(path.join(stage,'sync.json'),JSON.stringify({schema:1,repo:'/elsewhere'}));
  await assert.rejects(publish({stage}),/Invalid simulator synchronization stage/);
});

test('isolated preparation and publish use a fast-forward, and an already-pushed stage is retryable', async t => {
  const cp=require('node:child_process');
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sim-sync-flow-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const run=(cwd,...args)=>cp.execFileSync('git',args,{cwd,stdio:'pipe',encoding:'utf8'}).trim();
  const bare=path.join(dir,'remote.git'), sourceRepo=path.join(dir,'source-repo'), web=path.join(dir,'local-web'), stage=path.join(dir,'stage'), sim=path.join(dir,'sim');
  fs.mkdirSync(sourceRepo);fs.mkdirSync(web);fs.mkdirSync(path.join(sim,'ptcg-play/scripts'),{recursive:true});
  run(dir,'init','--bare','-b','main',bare);run(sourceRepo,'init','-b','main');
  run(sourceRepo,'config','user.name','Test User');run(sourceRepo,'config','user.email','test@example.invalid');
  const write=(f,s)=>{const dest=path.join(sourceRepo,f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s);};
  const mkMeta=(engine,snapshot)=>({schema:1,bundleSha256:hash(engine),bundleBytes:Buffer.byteLength(engine),sourceSnapshotSha256:hash(snapshot),sourceSnapshotBytes:Buffer.byteLength(snapshot),simulatorBuild:{packageHash:'new-package',inputHash:'build-input'}});
  write('package.json',JSON.stringify({name:'sim-sync-fixture',version:'1.0.0'}));
  write('package-lock.json',JSON.stringify({name:'sim-sync-fixture',version:'1.0.0',lockfileVersion:3,packages:{'':{name:'sim-sync-fixture',version:'1.0.0'}}}));
  write('lib/simulator-engine/service.mjs','old-engine');write('lib/simulator-engine/source-snapshot.json.gz','old-snapshot');write('lib/simulator-engine/provenance.json',JSON.stringify(mkMeta('old-engine','old-snapshot')));
  write('lib/data/simulator-card-art.json','old-art');
  write('scripts/refresh-simulator-card-art.cjs',`require('fs').writeFileSync('lib/data/simulator-card-art.json','new-art');`);
  const next=mkMeta('new-engine','new-snapshot');
  write('lib/simulator-engine/generate.cjs',`const fs=require('fs');fs.writeFileSync('lib/simulator-engine/service.mjs','new-engine');fs.writeFileSync('lib/simulator-engine/source-snapshot.json.gz','new-snapshot');fs.writeFileSync('lib/simulator-engine/provenance.json',${JSON.stringify(JSON.stringify(next))});`);
  write('lib/simulator-engine/verify.cjs','');write('lib/simulator-engine/engine.test.mjs','');write('tests/simulator-gzip-validation.test.cjs','');write('tests/simulator-card-art.test.cjs','');write('tests/simulator-version.test.cjs','');
  fs.writeFileSync(path.join(sim,'ptcg-play/scripts/build-attestation.cjs'),`console.log(JSON.stringify({inputHash:'build-input',packageHash:'new-package'}));`);
  run(sourceRepo,'add','.');run(sourceRepo,'commit','-m','base');run(sourceRepo,'remote','add','origin',bare);run(sourceRepo,'push','origin','main');
  run(web,'init');run(web,'config','user.name','Test User');run(web,'config','user.email','test@example.invalid');
  run(web,'remote','add','origin','https://github.com/jtrosclair/pokepuzzles-web.git');
  const global=path.join(dir,'gitconfig');fs.writeFileSync(global,`[url "file://${bare}"]\n insteadOf = https://github.com/jtrosclair/pokepuzzles-web.git\n`);
  const previous=process.env.GIT_CONFIG_GLOBAL;process.env.GIT_CONFIG_GLOBAL=global;
  t.after(()=>{if(previous===undefined)delete process.env.GIT_CONFIG_GLOBAL;else process.env.GIT_CONFIG_GLOBAL=previous;});
  const {prepare}=require('./sync-prizemap-engine.cjs');
  const meta=prepare({stage,web,source:sim});assert.equal(meta.changed,true);
  assert.equal(run(bare,'rev-parse','main'),meta.base,'prepare must not push');
  const changedFiles=run(meta.repo,'diff-tree','--no-commit-id','--name-only','-r',meta.commit).split('\n').sort();
  assert.deepEqual(changedFiles,['lib/data/simulator-card-art.json','lib/simulator-engine/provenance.json','lib/simulator-engine/service.mjs','lib/simulator-engine/source-snapshot.json.gz']);
  const fetchJson=async url=>url.includes('simulator-manifest')?{packageHash:'new-package'}:{bundleSha256:meta.bundleSha256,sourceSnapshotSha256:meta.snapshotSha256,artworkCatalogueSha256:meta.artworkSha256,simulatorPackageHash:'new-package'};
  const staleSnapshot=async url=>url.includes('simulator-manifest')?{packageHash:'new-package'}:{bundleSha256:meta.bundleSha256,sourceSnapshotSha256:'old',artworkCatalogueSha256:meta.artworkSha256,simulatorPackageHash:'new-package'};
  await assert.rejects(publish({stage},{fetchJson:staleSnapshot,timeoutMs:0}),/Timed out waiting/);
  assert.equal(run(bare,'rev-parse','main'),meta.commit,'a timed-out release can be retried');
  await publish({stage},{fetchJson,timeoutMs:100});
  assert.equal(run(bare,'rev-parse','main'),meta.commit);
  await publish({stage},{fetchJson,timeoutMs:100});
  run(sourceRepo,'fetch','origin','main');run(sourceRepo,'reset','--hard','FETCH_HEAD');
  write('unrelated.txt','concurrent release');run(sourceRepo,'add','unrelated.txt');run(sourceRepo,'commit','-m','concurrent release');run(sourceRepo,'push','origin','main');
  await assert.rejects(publish({stage},{fetchJson,timeoutMs:100}),/main changed since preparation/);
});
