import { Injectable, Optional } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { simulatorAssetPath, simulatorStaticBundle } from './simulator-static';
import { simulatorScanRequestUrl } from './simulator-scan-url';

const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';

/** Embedded UI resources and presentation URLs for native lazy-loaded images. */
@Injectable({ providedIn: 'root' })
export class SimulatorAssetsService {
  private failed = new Set<string>();
  private svgSource: { [path: string]: string } | undefined;
  private trustedSvgUrls = new Set<string>();
  private safeSvgUrls = new Map<string, SafeUrl>();

  constructor(@Optional() private sanitizer?: DomSanitizer) { }

  /** A puzzle can start immediately; only its embedded UI bundle is required. */
  public beginAttempt(): void {
    if (!simulatorStaticBundle()) {
      throw new Error('The simulator presentation payload did not finish downloading. Reload this page and retry.');
    }
    this.failed.clear();
    this.svgSource = undefined;
    this.trustedSvgUrls.clear();
    this.safeSvgUrls.clear();
  }

  public resolve(url: string): string {
    if (!url) { return url; }
    if (/^blob:/i.test(url)) { return this.placeholder(); }
    if (/^data:/i.test(url)) {
      return /^data:image\/svg/i.test(url) && !this.isPackagedSvg(url) ? this.placeholder() : url;
    }
    const asset = simulatorAssetPath(url);
    const bundled = asset && simulatorStaticBundle()?.urls[asset];
    if (bundled) { return bundled; }
    const resolved = simulatorScanRequestUrl(url, typeof document === 'undefined' ? undefined : document.baseURI);
    return this.failed.has(this.urlKey(resolved)) ? this.placeholder() : resolved;
  }

  /** Angular 12 excludes SVG from its data-URL allowlist. Trust only exact
   * reviewed SVG bytes already delivered in this immutable static bundle. */
  public imageSource(url: string): string | SafeUrl {
    const resolved = this.resolve(url);
    if (!this.isPackagedSvg(resolved)) { return resolved; }
    if (!this.sanitizer) { return PLACEHOLDER; }
    let safe = this.safeSvgUrls.get(resolved);
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustUrl(resolved);
      this.safeSvgUrls.set(resolved, safe);
    }
    return safe;
  }

  private isPackagedSvg(url: string): boolean {
    const urls = simulatorStaticBundle()?.urls;
    if (urls !== this.svgSource) {
      this.svgSource = urls;
      this.trustedSvgUrls = new Set(Object.values(urls || {}).filter(value => /^data:image\/svg\+xml[;,]/i.test(value)));
      this.safeSvgUrls.clear();
    }
    return this.trustedSvgUrls.has(url);
  }

  /** One fallback assignment; a broken fallback cannot recursively retry. */
  public fallbackImage(image: HTMLImageElement): void {
    const fallback = this.placeholder(), current = image.getAttribute('src') || image.src;
    if (!current || current === fallback) { return; }
    if (!/^(?:data:|blob:)/i.test(current)) { this.failed.add(this.urlKey(current)); }
    image.src = fallback;
  }

  private urlKey(url: string): string {
    try { return new URL(url, typeof document === 'undefined' ? undefined : document.baseURI).href; }
    catch { return url; }
  }

  private placeholder(): string { return simulatorStaticBundle()?.urls['assets/cardback.png'] || PLACEHOLDER; }
}
