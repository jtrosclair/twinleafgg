/** Versioned deployments serve supported scans through their own static host. */
export function simulatorScanRequestUrl(scanUrl: string, baseUri?: string): string {
  if (!baseUri) { return scanUrl; }
  try {
    const base = new URL(baseUri);
    const release = base.pathname.match(/^\/releases\/[a-f0-9]{64}\//);
    if (!release || !['http:', 'https:'].includes(base.protocol)
      || ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) { return scanUrl; }
    const scan = new URL(scanUrl);
    const supported = scan.hostname === 'images.pokemontcg.io'
      || (scan.hostname === 'limitlesstcg.nyc3.cdn.digitaloceanspaces.com' && /^\/(?:tpci|tpc)\//.test(scan.pathname));
    if (!supported || scan.protocol !== 'https:' || scan.username || scan.password || scan.port) { return scanUrl; }
    return new URL('/card-images?url=' + encodeURIComponent(scanUrl), base.origin).href;
  } catch {
    return scanUrl;
  }
}
