const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { aliases: imageAliases } = require('./ui-asset-aliases.json');
const types = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', ico: 'image/x-icon',
  woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf', eot: 'application/vnd.ms-fontobject'
};
function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory() ? filesIn(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
function resourceKey(url) {
  return '--simulator-ui-' + crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}
function svgDataUrl(bytes) {
  // Preserve reviewed SVG text exactly, including BOM/line endings. Encoding
  // markup as UTF-8 text lets HTTP compression see its repeated path commands.
  const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  // encodeURIComponent leaves these characters literal. Escape them too so a
  // URL remains inert in either quote style and in quoted/unquoted CSS url().
  const encoded = encodeURIComponent(text).replace(/[!'()*]/g,
    char => '%' + char.charCodeAt(0).toString(16).toUpperCase());
  return `data:image/svg+xml,${encoded}`;
}
function applyImageAliases(resources, aliases = imageAliases) {
  // Legacy PNG/WebP names are snapshot/runtime lookup keys. Point directly at
  // the current WebP or authored SVG, sharing its one immutable data URL.
  for (const [alias, target] of Object.entries(aliases)) {
    if (!Object.hasOwn(resources.urls, target)) { continue; }
    if (Object.hasOwn(resources.urls, alias) && resources.urls[alias] !== resources.urls[target]) {
      throw new Error(`Legacy image alias conflicts with a physical resource: ${alias}`);
    }
    resources.urls[alias] = resources.urls[target];
    resources.css[alias] = resourceKey(alias);
  }
  return resources;
}
function collectResources(root) {
  const urls = {}, json = {}, css = {};
  for (const file of filesIn(root)) {
    const name = path.relative(root, file).split(path.sep).join('/');
    if (name.startsWith('simulator-') || (name.startsWith('assets/simulator/')
      && !/^assets\/simulator\/cards\.(?:hash|[a-f0-9]{64})\.json$/.test(name))) { continue; }
    const extension = path.extname(name).slice(1).toLowerCase();
    if (types[extension]) {
      const bytes = fs.readFileSync(file);
      urls[name] = extension === 'svg' ? svgDataUrl(bytes)
        : `data:${types[extension]};base64,${bytes.toString('base64')}`;
      css[name] = resourceKey(name);
    } else if (extension === 'json' && name.startsWith('assets/')) {
      json[name] = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  }
  return applyImageAliases({ urls, json, css });
}
function presentationResources(resources) {
  // Fonts are already embedded in their @font-face declarations. The favicon
  // is loaded by the document's link element, never by the game image resolver.
  // Keep both out of the image table and its otherwise-unused CSS properties.
  const urls = Object.fromEntries(Object.entries(resources.urls)
    .filter(([name, value]) => name !== 'favicon.ico' && value.startsWith('data:image/')));
  return { urls, json: resources.json,
    css: Object.fromEntries(Object.entries(resources.css).filter(([name]) => Object.hasOwn(urls, name))) };
}
function bootstrap(resources) {
  resources = presentationResources(resources);
  // Load before Angular so component attributes can share immutable local URLs.
  // Webpack emits copies of source images under hashed names. Serialize each
  // data URL once, while preserving every lookup name used by components/CSS.
  const values = [], indexes = new Map(), urls = {};
  for (const [name, value] of Object.entries(resources.urls)) {
    if (!indexes.has(value)) { indexes.set(value, values.length); values.push(value); }
    urls[name] = indexes.get(value);
  }
  const data = { values, urls, json: resources.json, css: resources.css };
  return `(function(){var d=${JSON.stringify(data)},r={urls:{},json:d.json,css:d.css};Object.keys(d.urls).forEach(function(p){r.urls[p]=d.values[d.urls[p]];});globalThis.__SIMULATOR_STATIC__=r;Object.keys(r.css).forEach(function(p){document.documentElement.style.setProperty(r.css[p],'url("'+r.urls[p]+'")');});})();\n`;
}
module.exports = { filesIn, resourceKey, svgDataUrl, applyImageAliases, collectResources, presentationResources, bootstrap };
