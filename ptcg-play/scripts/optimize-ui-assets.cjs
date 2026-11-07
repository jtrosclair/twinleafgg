const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const manifestFile = path.join(__dirname, 'ui-assets-manifest.json');
const { aliases } = require('./ui-asset-aliases.json');
const maxHeight = 192;
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
function image(data) {
  let width, height, format;
  if (/^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/.test(data.toString('utf8', 0, Math.min(data.length, 1024)))) {
    const source = new TextDecoder('utf-8', { fatal: true }).decode(data);
    assert.ok(!/<!DOCTYPE|<!ENTITY|<\s*(?:script|foreignObject|image|iframe|object|embed|style)\b|\bon[a-z]+\s*=|@import/i.test(source),
      'Bundled SVG must contain only inert vector artwork');
    for (const match of source.matchAll(/(?:\b(?:href|xlink:href)\s*=\s*["']([^"']*)["']|url\(\s*["']?([^)'"\s]+))/gi)) {
      assert.match(match[1] || match[2], /^#[a-zA-Z_][\w:.-]*$/, 'Bundled SVG references must stay inside the same document');
    }
    const rootTag = source.match(/<svg\b([^>]*)>/);
    const dimension = name => {
      const value = rootTag[1].match(new RegExp('\\b' + name + '\\s*=\\s*["\']([0-9]+(?:\\.[0-9]+)?)(?:px)?["\']'));
      assert.ok(value, `Bundled SVG needs a fixed ${name}`);
      return Number(value[1]);
    };
    format = 'svg'; width = dimension('width'); height = dimension('height');
  } else if (data.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') {
    assert.ok(data.length >= 33, 'Truncated UI PNG');
    format = 'png'; width = data.readUInt32BE(16); height = data.readUInt32BE(20);
  } else {
    assert.ok(data.length >= 30 && data.toString('ascii', 0, 4) === 'RIFF'
      && data.toString('ascii', 8, 12) === 'WEBP', 'UI assets must be PNG, WebP or SVG files');
    assert.equal(data.readUInt32LE(4) + 8, data.length, 'Truncated or trailing UI WebP bytes');
    format = 'webp';
    let offset = 12;
    while (offset + 8 <= data.length) {
      const type = data.toString('ascii', offset, offset + 4);
      const length = data.readUInt32LE(offset + 4), start = offset + 8;
      assert.ok(start + length <= data.length, 'Truncated UI WebP chunk');
      if (type === 'VP8X' && length >= 10) {
        width = data.readUIntLE(start + 4, 3) + 1; height = data.readUIntLE(start + 7, 3) + 1; break;
      }
      if (type === 'VP8L' && length >= 5 && data[start] === 0x2f) {
        const bits = data.readUInt32LE(start + 1);
        width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1; break;
      }
      if (type === 'VP8 ' && length >= 10 && data.toString('hex', start + 3, start + 6) === '9d012a') {
        width = data.readUInt16LE(start + 6) & 0x3fff; height = data.readUInt16LE(start + 8) & 0x3fff; break;
      }
      offset = start + length + (length & 1);
    }
    assert.ok(width && height, 'UI WebP has no supported image header');
  }
  assert.ok(width && height, 'UI image dimensions must be positive');
  return { format, width, height, bytes: data.length, sha256: digest(data) };
}
function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? filesIn(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
function targetsFor(base) {
  return filesIn(path.join(base, 'src/assets')).map(file => path.relative(path.join(base, 'src'), file).split(path.sep).join('/'))
    .filter(name => /\.(?:png|webp|svg)$/.test(name)).sort();
}
function verifyAssets({ base = root, manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8')) } = {}) {
  assert.equal(manifest.version, 3, 'Unsupported UI asset manifest');
  assert.deepEqual(manifest.assets.map(asset => asset.path).sort(), targetsFor(base),
    'UI image inventory changed; update the verified asset manifest');
  for (const asset of manifest.assets) {
    const actual = image(fs.readFileSync(path.join(base, 'src', asset.path)));
    if (/^assets\/(energy|tools)\//.test(asset.path)) {
      assert.ok(actual.height <= maxHeight && actual.width <= maxHeight, `${asset.path} is oversized`);
    }
    assert.deepEqual(actual, asset.optimized, `${asset.path} changed; update its verified asset manifest`);
    assert.deepEqual(asset.legacyPaths.slice().sort(), Object.keys(aliases).filter(alias => aliases[alias] === asset.path).sort(),
      `${asset.path} legacy aliases differ from the committed manifest`);
    const conversion = asset.conversion;
    if (conversion.kind === 'authored-svg') {
      assert.equal(actual.format, 'svg');
      assert.equal(asset.original.sha256, actual.sha256, 'Authored SVGs must retain their reviewed bytes');
    } else if (conversion.kind === 'svg-replacement') {
      assert.equal(actual.format, 'svg');
      assert.equal(conversion.exactRGBA, false, 'SVG replacements must not claim raster pixel equivalence');
      assert.equal(conversion.renderedSizesPreserved, true);
      const optimization = asset.svgOptimization;
      if (optimization) {
        assert.equal(optimization.processor, 'svgo@4.1.0');
        assert.match(optimization.input.sha256, /^[a-f0-9]{64}$/);
        assert.equal(optimization.input.format, 'svg');
        assert.equal(optimization.input.width, actual.width, `${asset.path} SVG optimization changed its width`);
        assert.equal(optimization.input.height, actual.height, `${asset.path} SVG optimization changed its height`);
        assert.equal(optimization.outputSha256, actual.sha256, `${asset.path} differs from its SVG optimization evidence`);
        assert.ok(actual.bytes < optimization.input.bytes, `${asset.path} SVG optimization must reduce its source bytes`);
        if (optimization.mode === 'bounded-visual') {
          assert.ok(/^assets\/energy(?:-icons)?\//.test(asset.path), 'Bounded SVG simplification is verified only for energy artwork');
          assert.ok([0, 1, 2, 3].includes(optimization.coordinatePrecision));
          assert.equal(optimization.qualityMetric, 'isolated-glyph-iou-and-palette-v1');
          assert.equal(optimization.minimumFidelity, 0.95);
          assert.equal(optimization.visualReviewPassed, true);
          assert.ok(optimization.renderChecks.length >= 3, `${asset.path} needs display and enlarged SVG quality evidence`);
          for (const width of [24, 108, 512]) {
            assert.ok(optimization.renderChecks.some(check => check.width === width), `${asset.path} is missing SVG quality evidence at ${width}px`);
          }
          const requireGlyph = asset.path !== 'assets/energy-icons/energyless.svg';
          const fidelity = (value, label) => assert.ok(Number.isFinite(value) && value >= 0.95 && value <= 1,
            `${asset.path} ${label} must meet the 95% SVG fidelity floor`);
          for (const check of optimization.renderChecks) {
            assert.ok(Number.isInteger(check.width) && check.width > 0 && Number.isInteger(check.height) && check.height > 0);
            assert.equal(check.glyphRequired, requireGlyph);
            fidelity(check.canvasAlphaSoftIoU, 'canvas alpha overlap');
            fidelity(check.backgroundColorAccuracy, 'background color');
            if (requireGlyph) {
              assert.ok(check.glyphBaselineArea > 0 && check.glyphCandidateArea > 0, `${asset.path} cannot lose its energy glyph`);
              fidelity(check.glyphSoftIoU, 'glyph soft overlap');
              fidelity(check.glyphBinaryIoU, 'glyph binary overlap');
              fidelity(check.foregroundColorAccuracy, 'glyph color');
            } else {
              assert.equal(check.glyphBaselineArea, 0);
              assert.equal(check.glyphCandidateArea, 0, 'The blank cost symbol must remain blank');
            }
          }
        } else {
          assert.ok(optimization.mode === undefined || optimization.mode === 'pixel-identical', 'Unknown SVG optimization quality mode');
          assert.ok([6, 7, 8].includes(optimization.coordinatePrecision));
          assert.equal(optimization.sameCanonicalCommandTopology, true, `${asset.path} must preserve its vector contours`);
          assert.equal(optimization.curveSimplification, false);
          assert.equal(optimization.colorConversion, false);
          assert.ok(Number.isFinite(optimization.maxLocalCoordinateError)
            && optimization.maxLocalCoordinateError >= 0 && optimization.maxLocalCoordinateError <= 0.000001,
          `${asset.path} SVG coordinate error exceeds its verified precision`);
          assert.ok(optimization.renderChecks.length >= 4, `${asset.path} needs rendered comparison evidence`);
          assert.ok(optimization.renderChecks.some(check => check.actualDisplay), `${asset.path} needs display-size verification`);
          assert.ok(optimization.renderChecks.some(check => check.width >= 512), `${asset.path} needs enlarged verification`);
          for (const check of optimization.renderChecks) {
            assert.ok(Number.isInteger(check.width) && check.width > 0 && Number.isInteger(check.height) && check.height > 0);
            assert.equal(check.exactBytes, true, `${asset.path} SVG optimization must match its reference renders`);
            assert.equal(check.maxAlphaDifference, 0);
            assert.equal(check.maxPremultipliedRgbDifference, 0);
            assert.equal(check.maxBlackOrWhiteCompositeDifference, 0);
          }
        }
      }
      if (/^assets\/energy(?:-icons)?\//.test(asset.path)) {
        assert.ok(conversion.officialSource, `${asset.path} requires official vector source evidence`);
        assert.match(conversion.officialSource.url, /^https:\/\/assets\.pokemon\.com\/assets\/cms2\/pdf\/trading-card-game\/rulebook\//);
        assert.match(conversion.officialSource.sha256, /^[a-f0-9]{64}$/);
        assert.equal(conversion.officialSource.page, 4);
        // Keep the original official extraction evidence intact. Minification
        // records its input/output hashes and verified rendering separately.
        assert.equal(conversion.vectorEvidence?.sha256, optimization ? optimization.input.sha256 : actual.sha256,
          `${asset.path} differs from its official vector extraction evidence`);
        assert.ok(conversion.vectorEvidence.drawingIndexes.length > 0);
        assert.equal(!!conversion.vectorEvidence.blankDefault, asset.path === 'assets/energy-icons/energyless.svg');
      }
    } else {
      assert.equal(actual.width, asset.original.width, `${asset.path} conversion changed its width`);
      assert.equal(actual.height, asset.original.height, `${asset.path} conversion changed its height`);
      if (conversion.kind === 'lossy-webp') {
        assert.equal(actual.format, 'webp');
        assert.equal(conversion.quality, 75);
        assert.equal(conversion.exactRGBA, false, 'Lossy WebP must not claim raster pixel equivalence');
        assert.equal(conversion.alphaExact, true);
        assert.match(conversion.alphaSha256, /^[a-f0-9]{64}$/);
        assert.notEqual(conversion.originalRgbaSha256, conversion.optimizedRgbaSha256);
      } else {
        assert.equal(conversion.kind, 'preserved-lossless');
        assert.equal(conversion.exactRGBA, true);
        assert.equal(asset.original.sha256, actual.sha256, 'Preserved masks must retain their exact file bytes');
        assert.match(conversion.rgbaSha256, /^[a-f0-9]{64}$/);
      }
    }
  }
  for (const [alias, target] of Object.entries(aliases)) {
    assert.ok(!Object.hasOwn(aliases, target), `${alias} must point directly to its final image, not another alias`);
    assert.ok(manifest.assets.some(asset => asset.path === target), `${alias} points to a missing manifest image`);
    assert.ok(!fs.existsSync(path.join(base, 'src', alias)), `${alias} conflicts with a physical source image`);
  }
  return manifest;
}
function main() {
  // Both modes are Node-only. The committed WebPs and SVGs are the optimized
  // sources: rerunning must never resize, reencode, or rewrite their manifest.
  // A replacement's checked dimensions, alpha and honest lossy/vector
  // provenance are recorded separately; a build cannot manufacture that proof.
  const manifest = verifyAssets();
  const input = manifest.baseline.sourceImageBytes;
  const output = manifest.assets.reduce((sum, asset) => sum + asset.optimized.bytes, 0);
  console.log(`Verified UI assets: ${manifest.assets.length}, ${(input / 1048576).toFixed(2)} → ${(output / 1048576).toFixed(2)} MiB (${(100 * (1 - output / input)).toFixed(1)}% smaller; SVG replacements, WebP75 and lossless masks)`);
}
if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { image, targetsFor, verifyAssets };
