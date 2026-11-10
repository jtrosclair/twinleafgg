import { Card, CardList, PokemonCard, SuperType } from 'ptcg-server';
import { ElementRef, ɵɵsanitizeUrl } from '@angular/core';
import { ɵDomSanitizerImpl } from '@angular/platform-browser';
import { SimulatorAssetsService } from './simulator-assets.service';
import { StaticTranslateLoader } from './static-translate.loader';
import { simulatorScanRequestUrl } from './simulator-scan-url';
import { ImageCacheDirective } from '../image-cache/image-cache.directive';
import { BoardCardComponent } from '../../table/board/board-card/board-card.component';
import { EnergyTextDirective } from '../cards/energy/energy-text.directive';
import { PromptDiscardEnergyComponent } from '../../table/prompt/prompt-discard-energy/prompt-discard-energy.component';

describe('native lazy artwork loading', () => {
  let previousBundle: any;
  let previousDocument: PropertyDescriptor | undefined;
  let service: SimulatorAssetsService;
  let fetchSpy: jasmine.Spy;
  let createElement: jasmine.Spy;
  const dataImage = 'data:image/png;base64,dGVzdA==';
  const scan = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_001_R_EN.png';

  beforeEach(() => {
    previousBundle = (globalThis as any).__SIMULATOR_STATIC__;
    previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    (globalThis as any).__SIMULATOR_STATIC__ = { urls: { 'assets/cardback.png': dataImage,
      'assets/cardback.webp': dataImage }, json: {
      'assets/i18n/en.json': { TITLE: 'Puzzle' }, 'assets/i18n/fr.json': { TITLE: 'Puzzle FR' }
    } };
    createElement = jasmine.createSpy('createElement').and.throwError('No eager image or link creation');
    Object.defineProperty(globalThis, 'document', { configurable: true, value: {
      baseURI: 'https://sim.example/releases/' + 'a'.repeat(64) + '/', createElement,
      get head() { throw new Error('Do not enumerate/preload puzzle images'); },
      fonts: { ready: new Promise(() => {}) }
    } });
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(async () => { throw new Error('Artwork must use native lazy images'); });
    service = new SimulatorAssetsService();
  });

  afterEach(() => {
    (globalThis as any).__SIMULATOR_STATIC__ = previousBundle;
    if (previousDocument) { Object.defineProperty(globalThis, 'document', previousDocument); }
    else { delete (globalThis as any).document; }
  });

  it('starts an attempt synchronously without creating image/preload nodes, fetching, storage or font waits', () => {
    const prior = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB');
    const storage = jasmine.createSpy('indexedDB');
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, get: () => { storage(); throw new Error('Blocked'); } });
    try {
      expect(service.beginAttempt()).toBeUndefined();
      expect(createElement).not.toHaveBeenCalled();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(storage).not.toHaveBeenCalled();
    } finally {
      if (prior) { Object.defineProperty(globalThis, 'indexedDB', prior); }
      else { delete (globalThis as any).indexedDB; }
    }
  });

  it('reports a missing embedded UI bundle synchronously before game setup', () => {
    delete (globalThis as any).__SIMULATOR_STATIC__;
    expect(() => service.beginAttempt()).toThrowError(
      'The simulator presentation payload did not finish downloading. Reload this page and retry.');
    expect(createElement).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('resolves bundled resources and preserves ordinary URL sanitization without trusting SVG or blob payload URLs', () => {
    expect(service.resolve('assets/cardback.png')).toBe(dataImage);
    expect(service.resolve('/assets/cardback.png')).toBe(dataImage);
    expect(service.resolve('./assets/cardback.png?v=1#preview')).toBe(dataImage);
    expect(String(ɵɵsanitizeUrl(service.resolve('assets/cardback.png')))).toBe(dataImage);
    expect(service.resolve('blob:https://example.com/not-owned')).toBe(dataImage);
    expect(service.resolve('data:image/svg+xml,<svg/>')).toBe(dataImage);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('resolves a native image URL without changing the source artwork URL or size', () => {
    const directive = new ImageCacheDirective(service);
    const original = scan + '?size=original';
    const card = { cardImage: original };
    directive.src = card.cardImage;
    expect(new URL(directive.url).pathname).toBe('/card-images');
    expect(new URL(directive.url).searchParams.get('url')).toBe(original);
    expect(card.cardImage).toBe(original);
    expect(createElement).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('binds exact packaged SVG aliases and already-resolved bytes through Angular URL sanitization', () => {
    const source = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#123456" d="M0 0h1v1z"/></svg>';
    for (const svg of ['data:image/svg+xml;base64,' + Buffer.from(source).toString('base64'),
      'data:image/svg+xml,' + encodeURIComponent(source)]) {
      (globalThis as any).__SIMULATOR_STATIC__.urls = {
        'assets/cardback.png': dataImage, 'assets/cardback.svg': svg, 'assets/cardback.webp': svg
      };
      service = new SimulatorAssetsService(new ɵDomSanitizerImpl(document));
      const directive = new ImageCacheDirective(service);
      for (const url of ['assets/cardback.svg', 'assets/cardback.webp', svg]) {
        expect(service.resolve(url)).toBe(svg);
        directive.src = url;
        expect(String(ɵɵsanitizeUrl(directive.url))).toBe(svg);
      }
    }
    const untrusted = 'data:image/svg+xml,<svg onload="alert(1)"/>';
    expect(service.resolve(untrusted)).toBe(dataImage);
    expect(String(ɵɵsanitizeUrl(service.imageSource(untrusted)))).toBe(dataImage);
    // Remote custom art retains its previous URL behavior and receives no bypass.
    expect(service.imageSource('https://custom.example/art.svg')).toBe('https://custom.example/art.svg');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rewraps a packaged SVG fallback and retires trust when the static bundle changes', () => {
    const svg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"/>');
    (globalThis as any).__SIMULATOR_STATIC__.urls['assets/cardback.png'] = svg;
    service = new SimulatorAssetsService(new ɵDomSanitizerImpl(document));
    const directive = new ImageCacheDirective(service);
    directive.src = scan;
    let current = String(ɵɵsanitizeUrl(directive.url));
    const image: any = { getAttribute: () => current };
    Object.defineProperty(image, 'src', { get: () => current, set: value => current = value });
    directive.onError(image);
    expect(current).toBe(svg);
    expect(String(ɵɵsanitizeUrl(directive.url))).toBe(svg);
    (globalThis as any).__SIMULATOR_STATIC__.urls = { 'assets/cardback.png': dataImage };
    expect(service.resolve(svg)).toBe(dataImage);
    expect(String(ɵɵsanitizeUrl(service.imageSource(svg)))).toBe(dataImage);
  });

  it('assigns one local fallback for a failed image and retries the same art only on the next attempt', () => {
    const directive = new ImageCacheDirective(service);
    service.beginAttempt();
    directive.src = scan;
    const nativeUrl = directive.url;
    let current = directive.url, assignments = 0;
    const image: any = { getAttribute: () => current };
    Object.defineProperty(image, 'src', { get: () => current, set: value => { current = value; assignments++; } });
    directive.onError(image);
    directive.onError(image);
    expect(assignments).toBe(1);
    expect(directive.url).toBe(dataImage);
    expect(service.resolve(scan)).toBe(dataImage);
    service.beginAttempt();
    directive.src = scan;
    expect(directive.url).toBe(nativeUrl);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('switches languages from embedded data and rejects an absent bootstrap without requesting a locale', () => {
    const loader = new StaticTranslateLoader();
    loader.getTranslation('en').subscribe(value => expect(value.TITLE).toBe('Puzzle'));
    loader.getTranslation('fr').subscribe(value => expect(value.TITLE).toBe('Puzzle FR'));
    loader.getTranslation('missing').subscribe(value => expect(value).toEqual({}));
    delete (globalThis as any).__SIMULATOR_STATIC__;
    let failure: Error;
    loader.getTranslation('en').subscribe(() => fail('A missing bootstrap cannot fetch a fallback locale'), error => failure = error);
    expect(failure.message).toContain('Reload this page');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('face-down pile image visibility', () => {
  it('shares vector basic-energy attachments while retaining special-energy and Pokémon artwork', () => {
    const board = Object.create(BoardCardComponent.prototype) as BoardCardComponent;
    const prompt = Object.create(PromptDiscardEnergyComponent.prototype) as PromptDiscardEnergyComponent;
    const basics = { Grass: 'grass', Fire: 'fire', Water: 'water', Lightning: 'lightning', Psychic: 'psychic',
      Fighting: 'fighting', Darkness: 'dark', Metal: 'metal', Fairy: 'fairy' };
    for (const [name, file] of Object.entries(basics)) {
      const card = { name: name + ' Energy', superType: SuperType.ENERGY } as Card;
      expect(board.getCustomEnergyIcon(card)).toBe(`assets/energy/${file}.svg`);
      expect(prompt.getCustomEnergyImageUrl(card)).toBe(`assets/energy/${file}.svg`);
    }
    const special = { name: 'Double Turbo Energy', superType: SuperType.ENERGY } as Card;
    expect(board.getCustomEnergyIcon(special)).toBe('assets/energy/double-turbo.webp');
    expect(prompt.getCustomEnergyImageUrl(special)).toBe('assets/energy/double-turbo.webp');
    expect(board.getCustomEnergyIcon({ name: 'Electrode', superType: SuperType.POKEMON } as Card, true))
      .toBe('assets/energy/electrode.webp');
  });

  it('keeps an explicitly face-down deck layer hidden across fresh card-list inputs without changing its cards or count', () => {
    const component = new BoardCardComponent({} as any, new ElementRef({}));
    const card = new class extends PokemonCard { name = 'Hidden'; fullName = 'Hidden TEST'; set = 'TEST'; hp = 60; }();
    const cards = [card];
    component.owner = true;
    component.isFaceDown = true;
    component.cardList = { cards } as CardList;
    component.cardList = { cards } as CardList;
    expect(component.isFaceDown).toBe(true);
    expect(component.mainCard).toBe(card);
    expect(component.cardCount).toBe(1);
    expect(component.cardList.cards).toBe(cards);
    expect(cards).toEqual([card]);
    component.isFaceDown = false;
    expect(component.isFaceDown).toBe(false);
  });

  it('reveals private cards only to their owner and keeps secret prizes face down when ownership changes', () => {
    const component = new BoardCardComponent({} as any, new ElementRef({}));
    const list = new CardList();
    list.cards = [new class extends PokemonCard { name = 'Private'; fullName = 'Private TEST'; set = 'TEST'; hp = 60; }()];
    list.isPublic = false;
    list.isSecret = false;
    component.cardList = list;
    component.owner = false;
    expect(component.isFaceDown).toBe(true);
    component.owner = true;
    expect(component.isFaceDown).toBe(false);
    list.isSecret = true;
    component.cardList = list;
    component.owner = false;
    component.owner = true;
    expect(component.isFaceDown).toBe(true);
    expect(component.cardList).toBe(list);
    expect(component.cardCount).toBe(1);
  });

  it('honors an explicit prize reveal across card-list refreshes even when its original list remains private', () => {
    const component = new BoardCardComponent({} as any, new ElementRef({}));
    const list = new CardList();
    list.cards = [new class extends PokemonCard { name = 'Prize'; fullName = 'Prize TEST'; set = 'TEST'; hp = 60; }()];
    list.isPublic = false;
    list.isSecret = false;
    component.owner = false;
    component.isFaceDown = false;
    component.cardList = list;
    component.cardList = list;
    expect(component.isFaceDown).toBe(false);
    expect(component.cardList).toBe(list);
    expect(component.cardCount).toBe(1);
  });
});

describe('stable browser card scan URLs', () => {
  const release = '/releases/' + 'a'.repeat(64) + '/';
  const scan = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/CRZ/CRZ_GG23_R_EN.png';

  it('uses one stable root proxy URL for preload and image caching across releases', () => {
    for (const original of [scan, 'https://images.pokemontcg.io/base1/46.png']) {
      const first = simulatorScanRequestUrl(original, 'https://sim.example' + release);
      const next = simulatorScanRequestUrl(original, 'https://sim.example/releases/' + 'b'.repeat(64) + '/');
      expect(first).toBe(next);
      const result = new URL(first);
      expect(result.pathname).toBe('/card-images');
      expect(result.searchParams.get('url')).toBe(original);
    }
  });

  it('supports the existing Japanese path and does not rewrite scan size or source query', () => {
    const original = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/M5/M5_75_R_JP.png?size=original';
    const result = new URL(simulatorScanRequestUrl(original, 'https://sim.example' + release));
    expect(result.pathname).toBe('/card-images');
    expect(result.searchParams.get('url')).toBe(original);
  });

  it('keeps local and native file deployments direct', () => {
    for (const base of ['https://sim.example/sandbox-viewer', 'http://localhost:4200/',
      'http://127.0.0.1:4200' + release, 'http://[::1]:4200' + release,
      'file:///bundle' + release, 'file://' + release]) {
      expect(simulatorScanRequestUrl(scan, base)).toBe(scan);
    }
    expect(simulatorScanRequestUrl(scan)).toBe(scan);
  });

  it('refuses to proxy unsupported hosts, paths, schemes, ports or credentials', () => {
    for (const original of ['https://example.com/card.png', 'https://images.pokemontcg.io.evil.test/card.png',
      'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/other/card.png',
      'https://user:password@images.pokemontcg.io/card.png', 'https://images.pokemontcg.io:8080/card.png',
      'http://images.pokemontcg.io/card.png', 'data:image/png;base64,AA==', 'assets/cardback.png']) {
      expect(simulatorScanRequestUrl(original, 'https://sim.example' + release)).toBe(original);
    }
  });
});

describe('sanitized inline SVG energy symbols', () => {
  let originals: Map<string, PropertyDescriptor | undefined>;
  let host: HTMLElement;
  let directive: EnergyTextDirective;
  let urls: { [path: string]: string };
  const names = ['water', 'fighting', 'fairy', 'fire', 'grass', 'lightning', 'psychic', 'metal', 'darkness', 'colorless', 'dragon'];

  beforeEach(() => {
    const { JSDOM } = require('../../../../../tools/node_modules/jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    originals = new Map();
    const set = (key: string, value: any) => {
      originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
      Object.defineProperty(globalThis, key, { configurable: true, value });
    };
    set('document', dom.window.document);
    set('Node', dom.window.Node);
    urls = {};
    for (const name of names) {
      urls[`assets/energy-icons/${name}.svg`] = 'data:image/svg+xml;base64,'
        + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><title>${name}</title></svg>`).toString('base64');
    }
    set('__SIMULATOR_STATIC__', { urls, json: {} });
    host = document.createElement('div');
    const sanitizer = new ɵDomSanitizerImpl(document);
    directive = new EnergyTextDirective(new ElementRef(host), sanitizer, new SimulatorAssetsService(sanitizer));
    spyOn(console, 'warn').and.stub();
  });

  afterEach(() => {
    originals.forEach((value, key) => {
      if (value) { Object.defineProperty(globalThis, key, value); }
      else { delete (globalThis as any)[key]; }
    });
  });

  it('replaces all eleven text codes while preserving markup, attributes and effective 18px alignment', () => {
    directive.text = '<b title="[R]">Pay [W][F][Y][R][G][L][P][M][D][C][N]</b> [Q]';
    const images = Array.from(host.querySelectorAll('img'));
    expect(images.length).toBe(11);
    images.forEach((image, index) => {
      expect(image.src).toBe(urls[`assets/energy-icons/${names[index]}.svg`]);
      expect(image.alt).toBe(names[index] + ' Energy');
      expect(image.width).toBe(18);
      expect(image.height).toBe(18);
      expect(image.getAttribute('align')).toBe('top');
      expect(image.style.transform).toBe('');
      expect(image.getAttribute('loading')).toBe('lazy');
      expect(image.getAttribute('decoding')).toBe('async');
    });
    expect(host.querySelector('b').getAttribute('title')).toBe('[R]');
    expect(host.textContent).toBe('Pay  [Q]');
    directive.text = 'Done';
    expect(host.innerHTML).toBe('Done');
  });

  it('sanitizes supplied HTML before inserting trusted symbols without trusting supplied SVG or event handlers', () => {
    directive.text = '<b onclick="alert(1)">Safe [R]</b><script>alert(1)</script><svg onload="alert(1)"></svg>'
      + '<img src="data:image/svg+xml,untrusted" onerror="alert(1)">';
    expect(host.querySelector('script,svg,[onclick],[onload],[onerror]')).toBeNull();
    const images = host.querySelectorAll('img');
    expect(images[0].src).toBe(urls['assets/energy-icons/fire.svg']);
    expect(images[1].getAttribute('src')).toContain('unsafe:');
    expect(host.querySelector('b').textContent).toBe('Safe ');
  });
});
