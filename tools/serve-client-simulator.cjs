#!/usr/bin/env node
'use strict';

// Serve the standalone client with a locally selected PrizeMap puzzle.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const build = path.join(root, 'ptcg-play/dist/ptcg-play');
const port = Number(process.env.SIMULATOR_PORT || 4200);
if (!fs.existsSync(path.join(build, 'index.html'))) {
  console.error('Build the client first: npm run build');
  process.exit(1);
}
const puzzleFile = process.env.SIMULATOR_PUZZLE || path.join(__dirname, '.local-prizemap-puzzle.json');
const selected = fs.existsSync(puzzleFile) ? JSON.parse(fs.readFileSync(puzzleFile, 'utf8')) : undefined;
const stateData = selected?.stateData;
if (selected && (typeof stateData !== 'string' || !stateData)) throw new Error('The selected puzzle has no snapshot.');
const puzzleTarget = '/sandbox-viewer' + (stateData ? '#' + stateData : '');
const puzzlePage = `<!doctype html><title>PrizeMap local puzzle</title><script>location.replace(${JSON.stringify(puzzleTarget)});</script>`;
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};
const compressed = new Map();
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (pathname === '/puzzle') {
    res.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : puzzlePage);
    return;
  }
  let file = path.resolve(build, '.' + pathname);
  if (!file.startsWith(build + path.sep) && file !== build) {
    res.writeHead(403).end(); return;
  }
  if (file === build || !path.extname(file)) file = path.join(build, 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end(); return;
  }
  const extension = path.extname(file);
  const stat = fs.statSync(file);
  const isIndex = file === path.join(build, 'index.html');
  const readContent = () => {
    const bytes = fs.readFileSync(file);
    if (!isIndex) return bytes;
    // A post-build transformation can change an Angular bundle without changing
    // its webpack filename. Keep older local browser caches out of the way.
    return Buffer.from(bytes.toString().replace(/(src|href)="([^"?]+\.(?:js|css))"/g,
      (match, attribute, asset) => `${attribute}="${asset}?local=${stat.mtimeMs}"`));
  };
  const headers = {
    'Content-Type': types[extension] || 'application/octet-stream',
    // Revalidate local files so a rebuild is visible without clearing storage.
    'Cache-Control': 'no-cache',
    ETag: `W/"${stat.size}-${stat.mtimeMs}${isIndex ? '-local' : ''}"`,
    Vary: 'Accept-Encoding',
  };
  if (req.headers['if-none-match'] === headers.ETag) {
    res.writeHead(304, headers).end(); return;
  }
  let content;
  if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && /\.(html|js|css|json|svg)$/.test(file)) {
    const stamp = stat.mtimeMs;
    let cached = compressed.get(file);
    if (!cached || cached.stamp !== stamp) {
      cached = { stamp, content: zlib.gzipSync(readContent(), { level: 6 }) };
      compressed.set(file, cached);
    }
    content = cached.content;
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = content.length;
  } else {
    content = readContent();
    headers['Content-Length'] = content.length;
  }
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : content);
});
server.listen(port, '127.0.0.1', () => {
  // The scan CDN permits the localhost:4200 origin for its initial downloads.
  console.log(`Local PrizeMap puzzle: http://localhost:${port}/puzzle`);
  if (selected) console.log(`${selected.name} — published ${selected.publishedAt}`);
  console.log('Serving the standalone client; press Ctrl+C to stop.');
});
server.on('error', error => { console.error(error.message); process.exit(1); });
