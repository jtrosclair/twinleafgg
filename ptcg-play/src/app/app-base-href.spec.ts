import { APP_BASE_HREF, DOCUMENT, Location, PathLocationStrategy } from '@angular/common';
import { Injector } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';
import { of } from 'rxjs';
import { SIMULATOR_APP_BASE_HREF_PROVIDER, simulatorRoutingBaseHref, isPublicSimulatorFacade } from './app-base-href';
import { simulatorScanRequestUrl } from './shared/services/simulator-scan-url';
import { SandboxViewerComponent } from './sandbox-viewer/sandbox-viewer.component';

describe('simulator public and pinned route bases', () => {
  const release = `/releases/${'a'.repeat(64)}/`;
  const origin = 'https://sim-static.prizemap.app';

  function page(href: string, assetBase: string) {
    let current = new URL(href);
    const document = { location: current, baseURI: new URL(assetBase, current).href } as unknown as Document;
    const platform = {
      get pathname() { return current.pathname; }, get search() { return current.search; }, get hash() { return current.hash; },
      getBaseHrefFromDOM: () => new URL(document.baseURI).pathname,
      onPopState: () => () => {}, onHashChange: () => () => {},
      pushState: (_state: any, _title: string, url: string) => { current = new URL(url, current); }
    };
    const injector = Injector.create({ providers: [
      { provide: DOCUMENT, useValue: document }, SIMULATOR_APP_BASE_HREF_PROVIDER
    ] });
    const strategy = new PathLocationStrategy(platform as any, injector.get(APP_BASE_HREF));
    return { document, location: new Location(strategy, platform as any), current: () => current };
  }

  it('routes a stable public snapshot and local table ID without adding its asset release hash', () => {
    const value = page(`${origin}/sandbox-viewer?saved=1#SNAPSHOT%2B%2F%3D`, release);
    expect(simulatorRoutingBaseHref(value.document)).toBe('/');
    const parsed = new DefaultUrlSerializer().parse(value.location.path(true));
    expect(parsed.root.children.primary.segments.map(segment => segment.path)).toEqual(['sandbox-viewer']);
    expect(parsed.fragment).toBe('SNAPSHOT+/=');
    value.location.go('/table/17');
    expect(value.current().href).toBe(`${origin}/table/17`);
    expect(value.location.path()).toBe('/table/17');
    expect(new URL('main.js', value.document.baseURI).pathname).toBe(`${release}main.js`);
  });

  it('keeps pinned routes, fragments, and subsequent table navigation inside the selected release', () => {
    const value = page(`${origin}${release}sandbox-viewer#SNAPSHOT%2B%2F%3D`, release);
    expect(simulatorRoutingBaseHref(value.document)).toBe(release);
    expect(value.location.path(true)).toBe('/sandbox-viewer#SNAPSHOT%2B%2F%3D');
    expect(new DefaultUrlSerializer().parse(value.location.path(true)).fragment).toBe('SNAPSHOT+/=');
    value.location.go('/table/23');
    expect(value.current().pathname).toBe(`${release}table/23`);
    expect(value.location.path()).toBe('/table/23');
  });

  it('pins package resources while public routes and scan requests use stable origin paths', () => {
    for (const pathname of ['/sandbox-viewer', '/table/17']) {
      const value = page(origin + pathname, release);
      expect(value.location.prepareExternalUrl('/sandbox-viewer')).toBe('/sandbox-viewer');
      for (const resource of ['simulator-static.abc.js', 'main.abc.js', 'styles.abc.css', 'assets/simulator/cards.hash.json']) {
        expect(new URL(resource, value.document.baseURI).pathname).toBe(release + resource);
      }
      const scan = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/CRZ/CRZ_GG23_R_EN.png';
      expect(simulatorScanRequestUrl(scan, value.document.baseURI))
        .toBe(`${origin}/card-images?url=${encodeURIComponent(scan)}`);
    }
  });

  it('retains the bundle directory for file-origin routing and relative resources', () => {
    const value = page('file:///app/Puzzle%20Cache/index.html#SNAPSHOT', './');
    expect(simulatorRoutingBaseHref(value.document)).toBe('/app/Puzzle%20Cache/');
    value.location.go('/table/7');
    expect(value.current().href).toBe('file:///app/Puzzle%20Cache/table/7');
    expect(new URL('main.js', value.document.baseURI).href).toBe('file:///app/Puzzle%20Cache/main.js');
  });

  it('hides only public-facade board navigation while retaining the local table ID', async () => {
    const cases = [
      { href: `${origin}/sandbox-viewer#SNAPSHOT`, base: release, facade: true },
      { href: `${origin}${release}sandbox-viewer#SNAPSHOT`, base: release, facade: false },
      { href: 'http://localhost:4200/sandbox-viewer#SNAPSHOT', base: '/', facade: false },
      { href: 'file:///app/cache/index.html#SNAPSHOT', base: './', facade: false }
    ];
    for (const entry of cases) {
      const value = page(entry.href, entry.base);
      const original = value.current().href;
      expect(isPublicSimulatorFacade(value.document)).toBe(entry.facade);
      const router = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(false)) };
      const component = new SandboxViewerComponent({} as any, router as any,
        { session: { gameStates: [{ gameId: 3, localId: 17 }] } } as any,
        { instant: (key: string) => key } as any, {} as any,
        { getRawScanUrl: () => '' } as any, { createGameFromState: () => of({ gameId: 3 }) } as any,
        { beginAttempt: () => {} } as any,
        value.document);
      component.isReady = true;
      component.autoStartState = 'SNAPSHOT';
      component.stateDataInput = 'SNAPSHOT';
      component.loadGameState();
      await Promise.resolve();
      await Promise.resolve();
      expect(router.navigate).toHaveBeenCalledWith(['/table', 17], entry.facade ? { skipLocationChange: true } : undefined);
      expect(value.current().href).toBe(original);
      component.ngOnDestroy();
    }
  });
});
