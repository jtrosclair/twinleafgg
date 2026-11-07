import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { FactoryProvider } from '@angular/core';

const PINNED_RELEASE = /^\/releases\/[a-f0-9]{64}\//;

/** A public facade pins assets without exposing its release in the visible URL. */
export function isPublicSimulatorFacade(document: Document): boolean {
  if (!/^https?:$/.test(document.location.protocol) || PINNED_RELEASE.test(document.location.pathname)) {
    return false;
  }
  try {
    const base = new URL(document.baseURI);
    return /^https?:$/.test(base.protocol) && PINNED_RELEASE.test(base.pathname);
  } catch { return false; }
}

/** Public routes stay stable while document.baseURI pins their asset release. */
export function simulatorRoutingBaseHref(document: Document): string {
  const release = document.location.pathname.match(PINNED_RELEASE);
  if (release) { return release[0]; }
  if (document.location.protocol === 'file:') {
    // Retain the local bundle directory used by existing file-based WebViews.
    return new URL('.', document.baseURI).pathname;
  }
  return '/';
}

export const SIMULATOR_APP_BASE_HREF_PROVIDER: FactoryProvider = {
  provide: APP_BASE_HREF,
  useFactory: simulatorRoutingBaseHref,
  deps: [DOCUMENT]
};
