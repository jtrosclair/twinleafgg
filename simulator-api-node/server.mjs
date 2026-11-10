// Minimal HTTP transport for the shared, read-only simulator API. It streams
// input to the service's own bounded reader and streams the response to Node.
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import { handle } from './lib/service.mjs';

export function createApiServer({
  sharedSecret = process.env.SIMULATOR_API_SHARED_SECRET,
  requireAuthentication = process.env.SIMULATOR_API_REQUIRE_AUTH === 'true',
} = {}) {
  if (requireAuthentication && !sharedSecret) throw new Error('SIMULATOR_API_SHARED_SECRET is required when authentication is enforced');
  if (sharedSecret && !/^[\x21-\x7e]+$/.test(sharedSecret)) throw new Error('Invalid simulator API secret configuration');
  const expectedAuth = sharedSecret ? Buffer.from(`Bearer ${sharedSecret}`) : null;
  return createServer(async (incoming, outgoing) => {
    try {
      const target = new URL(incoming.url, 'http://localhost');
      if (target.pathname === '/healthz' && incoming.method === 'GET') {
        outgoing.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
        outgoing.end('{"ok":true}');
        return;
      }
      if (expectedAuth) {
        const actual = Buffer.from(incoming.headers.authorization || '');
        if (actual.length !== expectedAuth.length || !timingSafeEqual(actual, expectedAuth)) {
          outgoing.writeHead(401, { 'content-type': 'application/json', 'cache-control': 'no-store' });
          outgoing.end('{"ok":false,"error":"UNAUTHORIZED"}');
          return;
        }
      }
      const method = incoming.method || 'GET';
      const body = method === 'GET' || method === 'HEAD' ? undefined : Readable.toWeb(incoming);
      const request = new Request(target, {
        method, headers: incoming.headers, body, ...(body ? { duplex: 'half' } : {}),
      });
      const response = await handle(request);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) {
        const stream = Readable.fromWeb(response.body);
        stream.on('error', error => outgoing.destroy(error));
        stream.pipe(outgoing);
      }
      else outgoing.end();
    } catch (error) {
      console.error('Simulator API transport failed:', error);
      if (!outgoing.headersSent) outgoing.writeHead(500, { 'content-type': 'application/json' });
      outgoing.end('{"ok":false,"error":"INTERNAL_ERROR"}');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 8080);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new RangeError('Invalid PORT');
  createApiServer().listen(port, '0.0.0.0', () => console.log(`Simulator API listening on ${port}`));
}
