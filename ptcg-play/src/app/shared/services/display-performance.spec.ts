import { isLowGraphicsHardware, readDisplayPerformanceHints, resolveHoloEnabled } from './display-performance';
import { SettingsService } from './settings.service';

describe('automatic holographic effects', () => {
  it('keeps reduced-motion preferences separate from low-end graphics classification', () => {
    expect(isLowGraphicsHardware({ deviceMemory: 8, hardwareConcurrency: 8, reducedMotion: true })).toBe(false);
    expect(resolveHoloEnabled(null, { deviceMemory: 8, hardwareConcurrency: 8, reducedMotion: true })).toBe(false);
    expect(isLowGraphicsHardware({ deviceMemory: 2, hardwareConcurrency: 8 })).toBe(true);
  });
  it('disables effects for the eight-core A03s memory estimate even without reduced motion', () => {
    expect(resolveHoloEnabled(null, { deviceMemory: 2, hardwareConcurrency: 8 })).toBe(false);
  });

  it('retains effects on stronger hardware', () => {
    expect(resolveHoloEnabled(null, { deviceMemory: 8, hardwareConcurrency: 8 })).toBe(true);
    expect(resolveHoloEnabled(null, { deviceMemory: 4, hardwareConcurrency: 8 })).toBe(true);
  });

  it('uses modest CPU/memory combinations without treating every four-core device as weak', () => {
    expect(resolveHoloEnabled(null, { deviceMemory: 4, hardwareConcurrency: 4 })).toBe(false);
    expect(resolveHoloEnabled(null, { hardwareConcurrency: 2 })).toBe(false);
    expect(resolveHoloEnabled(null, { deviceMemory: 8, hardwareConcurrency: 4 })).toBe(true);
  });

  it('honors reduced motion and explicit on/off choices', () => {
    expect(resolveHoloEnabled(null, { reducedMotion: true })).toBe(false);
    expect(resolveHoloEnabled(true, { deviceMemory: 2, reducedMotion: true })).toBe(true);
    expect(resolveHoloEnabled(false, { deviceMemory: 8, hardwareConcurrency: 8 })).toBe(false);
  });

  it('falls back safely for missing or invalid hints and malformed saved values', () => {
    expect(resolveHoloEnabled(null, {})).toBe(true);
    expect(resolveHoloEnabled(null, { deviceMemory: 0, hardwareConcurrency: NaN })).toBe(true);
    expect(resolveHoloEnabled(null, { deviceMemory: Infinity, hardwareConcurrency: -1 })).toBe(true);
    expect(resolveHoloEnabled(null, { hardwareConcurrency: 1.5 })).toBe(true);
    expect(resolveHoloEnabled(null, { reducedMotion: 'false' as any })).toBe(true);
    expect(resolveHoloEnabled(null, { deviceMemory: NaN, hardwareConcurrency: 4 })).toBe(false);
    expect(resolveHoloEnabled('true', { deviceMemory: 2 })).toBe(false);
    expect(resolveHoloEnabled({}, { deviceMemory: 2 })).toBe(false);
  });
});

describe('holographic preference integration', () => {
  let descriptors: { [name: string]: PropertyDescriptor | undefined };
  let saved: { [key: string]: string };
  let writes: string[];

  beforeEach(() => {
    descriptors = {};
    for (const name of ['navigator', 'window', 'localStorage']) {
      descriptors[name] = Object.getOwnPropertyDescriptor(globalThis, name);
    }
    saved = {};
    writes = [];
    Object.defineProperty(globalThis, 'navigator', { configurable: true,
      value: { deviceMemory: 2, hardwareConcurrency: 8 } });
    Object.defineProperty(globalThis, 'window', { configurable: true,
      value: { matchMedia: () => ({ matches: false }) } });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => saved[key] === undefined ? null : saved[key],
      setItem: (key: string, value: string) => { saved[key] = value; writes.push(key); },
      removeItem: (key: string) => { delete saved[key]; }
    } });
  });

  afterEach(() => {
    for (const name of Object.keys(descriptors)) {
      if (descriptors[name]) { Object.defineProperty(globalThis, name, descriptors[name]!); }
      else { delete (globalThis as any)[name]; }
    }
  });

  const value = (service: SettingsService): boolean => {
    let enabled: boolean;
    service.holoEnabled$.subscribe(result => enabled = result).unsubscribe();
    return enabled!;
  };

  it('reads real browser hints and applies automatic mode without writing a sticky preference', () => {
    expect(readDisplayPerformanceHints()).toEqual({ deviceMemory: 2, hardwareConcurrency: 8, reducedMotion: false });
    expect(value(new SettingsService())).toBe(false);
    expect(new SettingsService().lowGraphics).toBe(true);
    expect(writes).toEqual([]);
  });

  it('preserves an existing manual preference and can return to automatic mode', () => {
    saved.holoEnabled = 'true';
    const service = new SettingsService();
    expect(value(service)).toBe(true);
    service.resetHoloEnabled();
    expect(value(service)).toBe(false);
    expect(saved.holoEnabled).toBeUndefined();
    service.setHoloEnabled(true);
    expect(value(service)).toBe(true);
    expect(value(new SettingsService())).toBe(true);
  });

  it('survives blocked storage and missing browser APIs', () => {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true,
      get: () => { throw new Error('Storage blocked'); } });
    expect(value(new SettingsService())).toBe(false);
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: undefined });
    Object.defineProperty(globalThis, 'window', { configurable: true, value: undefined });
    expect(value(new SettingsService())).toBe(true);
  });

  it('retains the available CPU hint when the memory getter throws', () => {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
      get deviceMemory() { throw new Error('Memory hint blocked'); }, hardwareConcurrency: 2
    } });
    expect(readDisplayPerformanceHints().hardwareConcurrency).toBe(2);
    expect(value(new SettingsService())).toBe(false);
  });

  it('retains the available memory hint when the CPU getter throws', () => {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
      deviceMemory: 2, get hardwareConcurrency() { throw new Error('CPU hint blocked'); }
    } });
    expect(readDisplayPerformanceHints().deviceMemory).toBe(2);
    expect(value(new SettingsService())).toBe(false);
  });
});
