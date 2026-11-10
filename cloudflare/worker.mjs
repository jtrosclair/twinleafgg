const HASH = /^[a-f0-9]{64}$/;
const RELEASE = /^\/releases\/([a-f0-9]{64})(\/.*)?$/;
const PROXY = /^(?:\/releases\/[a-f0-9]{64})?\/card-images$/;
const IMAGE_TTL = 86400;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TIMEOUT_MS = 10000;
const IMMUTABLE = 'public, max-age=31536000, immutable';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'If-None-Match',
  'Access-Control-Expose-Headers': 'ETag, Content-Length',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'X-Content-Type-Options': 'nosniff'
};

class ProxyError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function headers(extra = {}) { return new Headers({ ...CORS, ...extra }); }

function error(status, message, method) {
  return new Response(method === 'HEAD' ? null : `${message}\n`, {
    status, headers: headers({ 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' })
  });
}

function matchesEtag(request, etag) {
  const value = request.headers.get('If-None-Match');
  return Boolean(value && value.split(',').some(tag => tag.trim() === '*'
    || tag.trim().replace(/^W\//, '') === etag));
}

async function digest(bytes) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
    value => value.toString(16).padStart(2, '0')).join('');
}

function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = '';
  url.hash = '';
  return new Request(url, { method: 'GET', headers: { Accept: '*/*', 'Accept-Encoding': 'identity' } });
}

async function readManifest(request, env) {
  const response = await env.ASSETS.fetch(assetRequest(request, '/simulator-manifest.json'));
  if (response.status !== 200) throw new Error('Simulator manifest is unavailable');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 2 * 1024 * 1024) throw new Error('Simulator manifest is too large');
  let manifest;
  try { manifest = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new Error('Simulator manifest is invalid'); }
  if (manifest?.schemaVersion !== 1 || !HASH.test(manifest.packageHash)
    || manifest.packageBaseUrl !== `releases/${manifest.packageHash}/`
    || manifest.entrypoint !== 'index.html') throw new Error('Simulator manifest is invalid');
  return { manifest, bytes, etag: `"${await digest(bytes)}"` };
}

function isSpaPath(pathname) {
  return pathname === '/' || pathname === '/index.html'
    || /^\/sandbox-viewer\/?$/.test(pathname)
    || /^\/table(?:\/[^/.%\\]+)*\/?$/.test(pathname);
}

function redirect(request, pathname) {
  const url = new URL(request.url);
  // A Location without a fragment lets the browser inherit the original puzzle
  // snapshot fragment. Fragments are not available to the HTTP server.
  return new Response(null, { status: 307, headers: headers({
    Location: `${pathname}${url.search}`, 'Cache-Control': 'no-store'
  }) });
}

async function stablePage(request, env) {
  const { manifest } = await readManifest(request, env);
  const releaseRoot = `/releases/${manifest.packageHash}/`;
  const response = await env.ASSETS.fetch(assetRequest(request, `${releaseRoot}index.html`));
  if (response.status !== 200 || !/^text\/html(?:\s*;|$)/i.test(response.headers.get('Content-Type') || '')) {
    throw new Error('The selected simulator page is unavailable');
  }
  const source = await response.text();
  const base = /(<base\b[^>]*\bhref\s*=\s*)(["'])[^"']*\2/gi;
  if ([...source.matchAll(base)].length !== 1) throw new Error('The simulator page requires one base URL');
  // Only this mutable facade changes. The canonical release index, inventory,
  // and every versioned SPA response retain their original immutable bytes.
  const html = source.replace(base, (_match, prefix, quote) => `${prefix}${quote}${releaseRoot}${quote}`);
  const bytes = new TextEncoder().encode(html);
  const output = headers({
    'Cache-Control': 'no-store, no-transform', 'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': String(bytes.length),
    'X-Simulator-Package-Hash': manifest.packageHash,
    'Access-Control-Expose-Headers': 'ETag, Content-Length, X-Simulator-Package-Hash, X-Simulator-Build-Id'
  });
  if (typeof manifest.buildId === 'string') output.set('X-Simulator-Build-Id', manifest.buildId);
  // A public page always reads the current manifest and returns its HTML. Do
  // not propagate an immutable asset ETag or honor an old If-None-Match here.
  return new Response(request.method === 'HEAD' ? null : bytes, { headers: output });
}

function imageUrl(requestUrl) {
  if ([...requestUrl.searchParams.keys()].length !== 1 || !requestUrl.searchParams.has('url')) {
    throw new ProxyError(400, 'Exactly one image URL is required');
  }
  const value = requestUrl.searchParams.get('url');
  if (!value || value.length > 4096) throw new ProxyError(400, 'Invalid image URL');
  let url;
  try { url = new URL(value); } catch { throw new ProxyError(400, 'Invalid image URL'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) {
    throw new ProxyError(400, 'Image URL must use HTTPS without credentials, a custom port, or a fragment');
  }
  let decoded;
  try { decoded = decodeURIComponent(url.pathname); } catch { throw new ProxyError(400, 'Invalid image path'); }
  if (/%2f|%5c/i.test(url.pathname) || /[\\%\u0000-\u001f\u007f]/.test(decoded)
    || decoded.split('/').some(part => part === '.' || part === '..')) {
    throw new ProxyError(400, 'Invalid image path');
  }
  const limitless = url.hostname === 'limitlesstcg.nyc3.cdn.digitaloceanspaces.com'
    && /^\/(?:tpci|tpc)\//.test(decoded);
  if (!limitless && url.hostname !== 'images.pokemontcg.io') {
    throw new ProxyError(400, 'Image host or path is not supported');
  }
  return url;
}

function imageType(value, bytes) {
  const type = (value || '').split(';')[0].trim().toLowerCase().replace(/^image\/jpg$/, 'image/jpeg');
  const starts = signature => signature.every((byte, index) => bytes[index] === byte);
  const ascii = (start, end) => String.fromCharCode(...bytes.subarray(start, end));
  const valid = (type === 'image/png' && starts([137, 80, 78, 71, 13, 10, 26, 10]))
    || (type === 'image/jpeg' && starts([255, 216, 255]))
    || (type === 'image/gif' && ['GIF87a', 'GIF89a'].includes(ascii(0, 6)))
    || (type === 'image/webp' && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP');
  if (!valid) throw new ProxyError(415, 'Upstream response is not a supported image');
  return type;
}

async function loadImage(url, fetchImage, timeoutMs, maxBytes) {
  const controller = new AbortController();
  let reader;
  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      if (reader) reader.cancel().catch(() => {});
      reject(new ProxyError(504, 'Image request timed out'));
    }, timeoutMs);
  });
  try {
    return await Promise.race([timeout, (async () => {
      const response = await fetchImage(url.href, {
        method: 'GET', redirect: 'manual', signal: controller.signal,
        headers: { Accept: 'image/webp,image/png,image/jpeg,image/gif' }
      });
      if (response.status !== 200) {
        if (response.body) response.body.cancel().catch(() => {});
        throw new ProxyError(response.status === 404 ? 404 : 502, 'Image origin did not return an image');
      }
      const declared = response.headers.get('Content-Length');
      if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) {
        if (response.body) response.body.cancel().catch(() => {});
        throw new ProxyError(413, 'Image exceeds the size limit');
      }
      if (!response.body) throw new ProxyError(415, 'Image body is empty');
      reader = response.body.getReader();
      const chunks = [];
      let length = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > maxBytes) {
          reader.cancel().catch(() => {});
          throw new ProxyError(413, 'Image exceeds the size limit');
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      return { bytes, type: imageType(response.headers.get('Content-Type'), bytes) };
    })()]);
  } finally { clearTimeout(timer); }
}

function imageResponse(request, response) {
  const output = headers({ 'Cache-Control': `public, max-age=${IMAGE_TTL}` });
  for (const name of ['Content-Type', 'Content-Length', 'ETag']) {
    if (response.headers.has(name)) output.set(name, response.headers.get(name));
  }
  if (matchesEtag(request, output.get('ETag'))) {
    output.delete('Content-Length');
    return new Response(null, { status: 304, headers: output });
  }
  return new Response(request.method === 'HEAD' ? null : response.body, { headers: output });
}

export function createWorker({ fetchImage = globalThis.fetch,
  cache = globalThis.caches?.default, timeoutMs = IMAGE_TIMEOUT_MS,
  maxImageBytes = MAX_IMAGE_BYTES } = {}) {
  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: headers({
          'Access-Control-Max-Age': String(IMAGE_TTL), 'Cache-Control': 'no-store'
        }) });
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        const response = error(405, 'Only GET and HEAD are supported', request.method);
        response.headers.set('Allow', 'GET, HEAD, OPTIONS');
        return response;
      }
      if (PROXY.test(url.pathname)) {
        try {
          const target = imageUrl(url);
          // Share scan cache entries across versioned releases and normalize
          // input encoding. The client-supplied URL never becomes a fetch base.
          const key = new URL('/card-images', url.origin);
          key.searchParams.set('url', target.href);
          const cacheRequest = new Request(key, { method: 'GET' });
          const cached = await cache?.match(cacheRequest).catch(() => undefined);
          if (cached?.status === 200) return imageResponse(request, cached);
          const { bytes, type } = await loadImage(target, fetchImage, timeoutMs, maxImageBytes);
          const response = new Response(bytes, { headers: headers({
            'Content-Type': type, 'Content-Length': String(bytes.length),
            'Cache-Control': `public, max-age=${IMAGE_TTL}`, ETag: `"${await digest(bytes)}"`
          }) });
          if (cache) {
            const store = cache.put(cacheRequest, response.clone()).catch(() => {});
            if (ctx?.waitUntil) ctx.waitUntil(store); else await store;
          }
          return imageResponse(request, response);
        } catch (failure) {
          return error(failure instanceof ProxyError ? failure.status : 502,
            failure instanceof ProxyError ? failure.message : 'Image request failed', request.method);
        }
      }
      if (url.pathname === '/simulator-manifest.json') {
        try {
          const { bytes, etag } = await readManifest(request, env);
          const output = headers({ 'Cache-Control': 'no-cache',
            'Content-Type': 'application/json; charset=utf-8', ETag: etag });
          if (matchesEtag(request, etag)) return new Response(null, { status: 304, headers: output });
          output.set('Content-Length', String(bytes.length));
          return new Response(request.method === 'HEAD' ? null : bytes, { headers: output });
        } catch { return error(503, 'Simulator manifest is unavailable', request.method); }
      }
      if (isSpaPath(url.pathname)) {
        try {
          return await stablePage(request, env);
        } catch { return error(503, 'Simulator page is unavailable', request.method); }
      }
      const release = RELEASE.exec(url.pathname);
      if (release) {
        if (!release[2]) return redirect(request, `/releases/${release[1]}/`);
        const pathname = isSpaPath(release[2])
          ? `/releases/${release[1]}/index.html` : url.pathname;
        let response;
        try { response = await env.ASSETS.fetch(assetRequest(request, pathname)); }
        catch { return error(503, 'Release assets are unavailable', request.method); }
        if (response.status === 404) return error(404, 'Release asset not found', request.method);
        if (!response.ok) return error(503, 'Release assets are unavailable', request.method);
        const output = new Headers(response.headers);
        for (const [name, value] of Object.entries(CORS)) output.set(name, value);
        // HTML must remain byte-for-byte stable, without injected edge scripts.
        // Keep compression enabled for the much larger JS/CSS assets.
        const html = /^text\/html(?:\s*;|$)/i.test(output.get('Content-Type') || '');
        output.set('Cache-Control', html ? `${IMMUTABLE}, no-transform` : IMMUTABLE);
        return new Response(request.method === 'HEAD' ? null : response.body,
          { status: response.status, statusText: response.statusText, headers: output });
      }
      return error(404, 'Not found', request.method);
    }
  };
}

export default createWorker();
