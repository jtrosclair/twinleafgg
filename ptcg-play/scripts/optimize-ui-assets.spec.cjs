const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { image } = require('./optimize-ui-assets.cjs');

// Exercise the actual Node-only guard in an isolated source tree. A repeat
// optimization is a no-op; inventory, dimensions and committed hashes are fixed.
const source = path.resolve(__dirname, '..');
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-ui-assets-test-'));
try {
  fs.mkdirSync(path.join(fixture, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(fixture, 'src'), { recursive: true });
  for (const name of ['optimize-ui-assets.cjs', 'ui-assets-manifest.json', 'ui-asset-aliases.json']) {
    fs.copyFileSync(path.join(__dirname, name), path.join(fixture, 'scripts', name));
  }
  fs.cpSync(path.join(source, 'src/assets'), path.join(fixture, 'src/assets'), { recursive: true });
  const run = (...args) => spawnSync(process.execPath, [path.join(fixture, 'scripts/optimize-ui-assets.cjs'), ...args], { encoding: 'utf8' });
  assert.equal(run('--check').status, 0, 'The committed UI images must pass the build guard');
  const manifest = path.join(fixture, 'scripts/ui-assets-manifest.json');
  const beforeManifest = fs.readFileSync(manifest);
  const staleAuthoredArtwork = JSON.parse(beforeManifest);
  staleAuthoredArtwork.assets.find(asset => asset.conversion.kind === 'authored-svg').original.sha256 = '0'.repeat(64);
  fs.writeFileSync(manifest, JSON.stringify(staleAuthoredArtwork));
  assert.match(run('--check').stderr, /Authored SVGs must retain their reviewed bytes/);
  const falseLossless = JSON.parse(beforeManifest);
  falseLossless.assets.find(asset => asset.conversion.kind === 'lossy-webp').conversion.exactRGBA = true;
  fs.writeFileSync(manifest, JSON.stringify(falseLossless));
  assert.match(run('--check').stderr, /Lossy WebP must not claim raster pixel equivalence/);
  const falseVectorEquivalence = JSON.parse(beforeManifest);
  falseVectorEquivalence.assets.find(asset => asset.conversion.kind === 'svg-replacement').conversion.exactRGBA = true;
  fs.writeFileSync(manifest, JSON.stringify(falseVectorEquivalence));
  assert.match(run('--check').stderr, /SVG replacements must not claim raster pixel equivalence/);
  const missingOfficialEvidence = JSON.parse(beforeManifest);
  delete missingOfficialEvidence.assets.find(asset => asset.path === 'assets/energy-icons/fire.svg').conversion.officialSource;
  fs.writeFileSync(manifest, JSON.stringify(missingOfficialEvidence));
  assert.match(run('--check').stderr, /requires official vector source evidence/);
  const staleVectorEvidence = JSON.parse(beforeManifest);
  staleVectorEvidence.assets.find(asset => asset.path === 'assets/energy-icons/fire.svg').conversion.vectorEvidence.sha256 = '0'.repeat(64);
  fs.writeFileSync(manifest, JSON.stringify(staleVectorEvidence));
  assert.match(run('--check').stderr, /differs from its official vector extraction evidence/);
  const staleOptimization = JSON.parse(beforeManifest);
  staleOptimization.assets.find(asset => asset.svgOptimization).svgOptimization.outputSha256 = '0'.repeat(64);
  fs.writeFileSync(manifest, JSON.stringify(staleOptimization));
  assert.match(run('--check').stderr, /differs from its SVG optimization evidence/);
  const simplified = JSON.parse(beforeManifest).assets.find(asset => asset.svgOptimization?.mode === 'bounded-visual');
  assert.ok(simplified, 'The reviewed simplified energy artwork must exercise the visual fidelity guard');
  for (const field of ['glyphSoftIoU', 'glyphBinaryIoU', 'canvasAlphaSoftIoU', 'foregroundColorAccuracy', 'backgroundColorAccuracy']) {
    const belowQualityFloor = JSON.parse(beforeManifest);
    belowQualityFloor.assets.find(asset => asset.path === simplified.path).svgOptimization.renderChecks[0][field] = 0.949;
    fs.writeFileSync(manifest, JSON.stringify(belowQualityFloor));
    assert.match(run('--check').stderr, /must meet the 95% SVG fidelity floor/, field);
  }
  const weakenedQualityFloor = JSON.parse(beforeManifest);
  weakenedQualityFloor.assets.find(asset => asset.path === simplified.path).svgOptimization.minimumFidelity = 0.9;
  fs.writeFileSync(manifest, JSON.stringify(weakenedQualityFloor));
  assert.notEqual(run('--check').status, 0, 'A manifest cannot lower the accepted fidelity threshold');
  const missingLargeRender = JSON.parse(beforeManifest);
  missingLargeRender.assets.find(asset => asset.path === simplified.path).svgOptimization.renderChecks
    .filter(check => check.width === 512).forEach(check => { check.width = 256; });
  fs.writeFileSync(manifest, JSON.stringify(missingLargeRender));
  assert.match(run('--check').stderr, /missing SVG quality evidence at 512px/);
  const inventedBlankGlyph = JSON.parse(beforeManifest);
  inventedBlankGlyph.assets.find(asset => asset.path === 'assets/energy-icons/energyless.svg').svgOptimization.renderChecks[0].glyphCandidateArea = 1;
  fs.writeFileSync(manifest, JSON.stringify(inventedBlankGlyph));
  assert.match(run('--check').stderr, /blank cost symbol must remain blank/);
  fs.writeFileSync(manifest, beforeManifest);
  const file = path.join(fixture, 'src/assets/energy/mist.webp');
  const original = fs.readFileSync(file);
  assert.equal(run().status, 0, 'Repeat optimization must work without native encoder dependencies');
  assert.deepEqual(fs.readFileSync(file), original, 'Repeat optimization must preserve exact source bytes');
  assert.deepEqual(fs.readFileSync(manifest), beforeManifest, 'Repeat optimization must preserve conversion evidence');
  const oversized = Buffer.from(original);
  const type = oversized.toString('ascii', 12, 16);
  if (type === 'VP8L') {
    const value = oversized.readUInt32LE(21);
    oversized.writeUInt32LE(((value & ~(0x3fff << 14)) | ((1042 - 1) << 14)) >>> 0, 21);
  } else if (type === 'VP8X') { oversized.writeUIntLE(1042 - 1, 27, 3); }
  else { throw new Error('Expected a committed lossless WebP header'); }
  fs.writeFileSync(file, oversized);
  assert.match(run('--check').stderr, /is oversized/);
  const changed = Buffer.from(original);
  changed[changed.length - 1] ^= 1;
  fs.writeFileSync(file, changed);
  assert.match(run('--check').stderr, /changed; update its verified asset manifest/);
  fs.writeFileSync(file, original);
  fs.copyFileSync(file, path.join(fixture, 'src/assets/energy/new-energy.webp'));
  assert.match(run('--check').stderr, /UI image inventory changed/);
  fs.unlinkSync(path.join(fixture, 'src/assets/energy/new-energy.webp'));
  fs.unlinkSync(file);
  assert.match(run('--check').stderr, /UI image inventory changed/);
  assert.throws(() => image(Buffer.from('RIFF')), /PNG, WebP or SVG/);
  assert.throws(() => image(original.subarray(0, original.length - 1)), /Truncated or trailing/);
  // Node-only dimensions support ordinary lossy WebP too; this does not permit
  // an existing manifest image to change format or checksum.
  const vp8 = Buffer.alloc(30); vp8.write('RIFF'); vp8.writeUInt32LE(22, 4); vp8.write('WEBPVP8 ', 8);
  vp8.writeUInt32LE(10, 16); Buffer.from('9d012a', 'hex').copy(vp8, 23); vp8.writeUInt16LE(138, 26); vp8.writeUInt16LE(192, 28);
  assert.equal(image(vp8).height, 192);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="138" height="192" viewBox="0 0 138 192"><path d="M0 0h1v1z"/></svg>';
  assert.equal(image(Buffer.from(svg)).format, 'svg');
  assert.equal(image(Buffer.from(svg)).height, 192);
  assert.throws(() => image(Buffer.from(svg.replace('<path', '<script>bad</script><path'))), /inert vector/);
  assert.throws(() => image(Buffer.from(svg.replace('<path', '<image href="data:image/png;base64,AA"/><path'))), /inert vector/);
  assert.throws(() => image(Buffer.from(svg.replace('<path', '<use href="https://example.test/symbol.svg#shape"/><path'))), /same document/);
  assert.throws(() => image(Buffer.from(svg.replace('width="138"', 'width="100%"'))), /fixed width/);
  console.log('UI asset guard passed: SVG/WebP inventory accepted; repeat mode unchanged; invalid provenance, oversized, changed, missing, untracked, truncated and active SVG content rejected.');
} finally { fs.rmSync(fixture, { recursive: true, force: true }); }
