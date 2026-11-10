'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');
const { auditAssets } = require('./audit-simulator-assets.cjs');

function fixture(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-asset-audit-'));
  function write(name, text = 'fixture') {
    const target = path.join(root, 'src', name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
  for (const [name, text] of Object.entries(files)) write(name, text);
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, write, audit: () => auditAssets({ root }) };
}

test('literal TS/HTML/SCSS assets and direct favicon have source evidence', t => {
  const value = fixture(t, {
    'app/main.ts': "const card = 'assets/card.png';",
    'app/view.html': '<img src="assets/logo.webp"><img [src]="\'assets/card.png\'">',
    'app/view.scss': 'body { background: url(~src/assets/background.png); }',
    'index.html': '<link rel="icon" href="favicon.ico">',
    'assets/card.png': 'card', 'assets/logo.webp': 'logo', 'assets/background.png': 'background', 'favicon.ico': 'icon'
  });
  const report = value.audit();
  assert.equal(report.passed, true);
  assert.equal(report.summary.referenced, 4);
  for (const asset of report.assets) {
    assert(asset.evidence.length > 0);
    assert(asset.evidence.every(proof => proof.file.startsWith('src/') && proof.line >= 1));
  }
});

test('a newly introduced unused asset fails the guard and its CLI, regardless of extension', t => {
  const value = fixture(t, { 'app/main.ts': "const card = 'assets/card.png';", 'assets/card.png': 'card',
    'assets/new-unused.png': 'extra', 'assets/unused-settings.json': '{}' });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.deepEqual(report.unused.map(asset => asset.path), ['assets/new-unused.png', 'assets/unused-settings.json']);
  const output = path.join(value.root, 'report.json');
  assert.throws(() => execFileSync(process.execPath, [path.join(__dirname, 'audit-simulator-assets.cjs'),
    '--root', value.root, '--report', output], { stdio: 'pipe' }), failure => failure.status === 1);
  assert.equal(JSON.parse(fs.readFileSync(output, 'utf8')).passed, false);
});

test('missing literal and relative-CSS files fail with precise consumer evidence', t => {
  const value = fixture(t, { 'app/main.ts': "const missing = 'assets/missing.png';",
    'index.html': '<link href="assets/icons/icons.css" rel="stylesheet">',
    'assets/icons/icons.css': '@font-face { src: url(Missing.woff2); }' });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.deepEqual(report.missing.map(asset => asset.path).sort(), ['assets/icons/Missing.woff2', 'assets/missing.png']);
  assert.equal(report.missing.find(asset => asset.path.endsWith('.woff2')).evidence[0].file, 'src/assets/icons/icons.css');
});

test('test files, compiled JavaScript, and TS/HTML/CSS/SCSS comments do not make an orphan reachable', t => {
  const value = fixture(t, {
    'app/main.ts': "// 'assets/orphan.png'\n/* const a='assets/orphan.png'; */\nconst live='assets/live.png';",
    'app/main.spec.ts': "const image = 'assets/orphan.png';",
    'app/main.test.ts': "const image = 'assets/orphan.png';",
    'app/main.d.ts': "declare const image: 'assets/orphan.png';",
    'app/main.js': "const image = 'assets/orphan.png';",
    'test.ts': "const image = 'assets/orphan.png';",
    'app/view.html': '<!-- <img src="assets/orphan.png"> --><span style="/* background: url(/assets/orphan.png); */"></span>',
    'app/view.scss': '// background:url(/assets/orphan.png)\n/* background:url(/assets/orphan.png) */',
    'app/view.css': '/* background:url(/assets/orphan.png) */',
    'assets/live.png': 'live', 'assets/orphan.png': 'orphan'
  });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.deepEqual(report.unused.map(asset => asset.path), ['assets/orphan.png']);
});

test('inline Angular component CSS uses stylesheet parsing so comment-only URLs cannot retain assets', t => {
  const value = fixture(t, {
    'app/view.ts': "import { Component as View } from '@angular/core';\n@View({styles: ['/* background:url(assets/dead.png) */ .live { background:url(/assets/live.png); }', `/* url(assets/dead.png) */`]}) class Example {}",
    'assets/live.png': 'live', 'assets/dead.png': 'dead'
  });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.deepEqual(report.unused.map(asset => asset.path), ['assets/dead.png']);
  assert.equal(report.assets.find(asset => asset.path === 'assets/live.png').evidence[0].kind, 'css-url');
  assert.equal(report.assets.find(asset => asset.path === 'assets/live.png').evidence[0].line, 2);
});

test('HTML srcset candidates accept comma separators, descriptors, and external/data URL candidates', t => {
  const value = fixture(t, {
    'app/view.html': '<img srcset="assets/a.png, assets/b.png"><img srcset="assets/a.png 1x, assets/b.png 2x"><source srcset="data:image/png;base64,AA== 1x, assets/c.png 2x"><img srcset="https://example.com/assets/external.png 1x, assets/a.png 2x">',
    'app/inline.ts': "import { Component } from '@angular/core'; @Component({template: `<img srcset=\"assets/a.png, assets/b.png 2x\">`}) class Example {}",
    'assets/a.png': 'a', 'assets/b.png': 'b', 'assets/c.png': 'c'
  });
  const report = value.audit();
  assert.equal(report.passed, true);
  assert.equal(report.summary.missing, 0);
  assert(report.assets.every(asset => asset.evidence.some(proof => proof.kind === 'html-srcset')));
  assert(report.assets.find(asset => asset.path === 'assets/a.png').evidence.some(proof => proof.file === 'src/app/inline.ts'));
});

test('parent-relative HTML asset URLs fail with an explicit release-base diagnostic', t => {
  const value = fixture(t, { 'app/view.html': '<img src="../assets/a.png"><img src="assets/a.png">', 'assets/a.png': 'a' });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.equal(report.summary.unused, 0);
  assert.equal(report.missing[0].path, '../assets/a.png');
  assert.match(report.missing[0].reason, /escapes the pinned release base/);
});

test('energy icon templates expand only actual energyImageMap values, retaining evidence for each', t => {
  const value = fixture(t, {
    'app/card-info-pane.component.ts': "class Pane { private energyImageMap = { 'R':'fire', 'W':'water' }; render(type) { return `assets/energy-icons/${this.energyImageMap[type]}.webp`; } }",
    'assets/energy-icons/fire.webp': 'fire', 'assets/energy-icons/water.webp': 'water'
  });
  const report = value.audit();
  assert.equal(report.passed, true);
  for (const asset of report.assets) {
    assert.equal(asset.evidence[0].kind, 'dynamic-energy-map');
    assert.equal(asset.evidence[0].definition.map, 'energyImageMap');
  }
  value.write('assets/energy-icons/not-in-map.webp', 'unused');
  assert.deepEqual(value.audit().unused.map(asset => asset.path), ['assets/energy-icons/not-in-map.webp']);
  fs.rmSync(path.join(value.root, 'src/assets/energy-icons/fire.webp'));
  assert.equal(value.audit().missing[0].path, 'assets/energy-icons/fire.webp');
});

test('translation templates retain exactly the production environment languages, not arbitrary locales', t => {
  const value = fixture(t, {
    'environments/environment.prod.ts': "export const environment={languages:{en:'English',jp:'日本語'}};",
    'app/static-translate.loader.ts': 'class Loader { load(language) { return `assets/i18n/${language}.json`; } }',
    'assets/i18n/en.json': '{}', 'assets/i18n/jp.json': '{}'
  });
  assert.equal(value.audit().passed, true);
  assert(value.audit().assets.every(asset => asset.evidence[0].kind === 'dynamic-language-map'));
  value.write('assets/i18n/unused.json', '{}');
  assert.deepEqual(value.audit().unused.map(asset => asset.path), ['assets/i18n/unused.json']);
});

test('Sass interpolated mask paths expand from their enclosing literal map without evaluating Sass', t => {
  const value = fixture(t, {
    'app/card.scss': "$holo-types: ('holo':'card-mask', 'fullart':'fa-mask');\n@each $type, $mask in $holo-types { .#{$type} { mask-image: url('/assets/#{$mask}.png'); } }",
    'assets/card-mask.png': 'mask', 'assets/fa-mask.png': 'fullart'
  });
  assert.equal(value.audit().passed, true);
  assert(value.audit().assets.every(asset => asset.evidence[0].kind === 'dynamic-sass-map'));
  value.write('assets/other-mask.png', 'unused');
  assert.deepEqual(value.audit().unused.map(asset => asset.path), ['assets/other-mask.png']);
});

test('only reachable asset stylesheets can keep their dependent font files alive', t => {
  const value = fixture(t, {
    'index.html': '<link rel="stylesheet" href="assets/icons/live.css">',
    'assets/icons/live.css': '@font-face { src: url(Live.woff2); }', 'assets/icons/Live.woff2': 'livefont',
    'assets/icons/orphan.css': '@font-face { src: url(Orphan.woff2); }', 'assets/icons/Orphan.woff2': 'unusedfont'
  });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.deepEqual(report.unused.map(asset => asset.path), ['assets/icons/Orphan.woff2', 'assets/icons/orphan.css']);
  assert.equal(report.assets.find(asset => asset.path.endsWith('/Live.woff2')).evidence[0].kind, 'css-url');
});

test('unrecognized dynamic source references fail rather than granting a directory-wide exception', t => {
  const value = fixture(t, { 'app/main.ts': 'const image = `assets/other/${arbitrary}.png`;', 'assets/other/a.png': 'a' });
  const report = value.audit();
  assert.equal(report.passed, false);
  assert.equal(report.summary.unresolvedDynamic, 1);
  assert.equal(report.summary.unused, 1);
});

test('generated simulator metadata, .gitkeep, external URLs, and data URLs are outside this audit', t => {
  const value = fixture(t, { 'assets/.gitkeep': '', 'assets/simulator/cards.hash.json': '{}',
    'assets/simulator/cards.generated.json': '{}', 'app/main.ts':
      'const card=`assets/simulator/cards.${hash}.json`; const external="https://example.com/assets/external.png"; const data="data:image/png;base64,AA==";' });
  const report = value.audit();
  assert.equal(report.passed, true);
  assert.equal(report.summary.assets, 0);
  assert.equal(report.summary.missing, 0);
});

test('finite SVG energy templates retain only map values and still reject unused or missing vectors', t => {
  const value = fixture(t, {
    'app/pane.ts': 'class Pane { energyImageMap={R:"fire",W:"water"}; icon(type) { return `assets/energy-icons/${this.energyImageMap[type]}.svg`; } }',
    'assets/energy-icons/fire.svg': '<svg/>', 'assets/energy-icons/water.svg': '<svg/>'
  });
  assert.equal(value.audit().passed, true);
  assert(value.audit().assets.every(asset => asset.evidence[0].kind === 'dynamic-energy-map'));
  value.write('assets/energy-icons/unused.svg', '<svg/>');
  assert.deepEqual(value.audit().unused.map(asset => asset.path), ['assets/energy-icons/unused.svg']);
  fs.unlinkSync(path.join(value.root, 'src/assets/energy-icons/fire.svg'));
  assert.equal(value.audit().missing[0].path, 'assets/energy-icons/fire.svg');
});
