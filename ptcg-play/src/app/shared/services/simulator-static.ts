/** Loaded before Angular by the generated static bootstrap script. */
export interface SimulatorStaticBundle {
  urls: { [path: string]: string };
  json: { [path: string]: any };
}

export function simulatorStaticBundle(): SimulatorStaticBundle | undefined {
  return (globalThis as any).__SIMULATOR_STATIC__;
}

/** Match source-relative and same-origin absolute URLs to build manifest paths. */
export function simulatorAssetPath(url: string): string | undefined {
  if (!url || /^(data:|blob:)/.test(url)) { return undefined; }
  if (/^(https?:)?\/\//.test(url)) {
    if (typeof location === 'undefined') { return undefined; }
    const absolute = new URL(url, location.href);
    if (absolute.origin !== location.origin) { return undefined; }
    return absolute.pathname.replace(/^\//, '');
  }
  return url.split(/[?#]/)[0].replace(/^\.\//, '').replace(/^\//, '');
}
