/** Coarse browser hints, not an exact hardware/GPU classification. */
export interface DisplayPerformanceHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  reducedMotion?: boolean;
}

const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
const coreCount = (value: unknown): value is number =>
  positive(value) && Number.isSafeInteger(value);

/** Static decoration can be simplified independently of motion preferences. */
export function isLowGraphicsHardware(hints: DisplayPerformanceHints): boolean {
  return (positive(hints.deviceMemory) && hints.deviceMemory <= 2)
    || (coreCount(hints.hardwareConcurrency) && hints.hardwareConcurrency <= 4
      && (!positive(hints.deviceMemory) || hints.deviceMemory <= 4));
}

/** A saved user choice wins; automatic decisions are never persisted. */
export function resolveHoloEnabled(preference: unknown, hints: DisplayPerformanceHints): boolean {
  if (typeof preference === 'boolean') { return preference; }
  if (hints.reducedMotion === true) { return false; }
  // Chromium rounds this value; the 3 GB Galaxy A03s reports 2 GiB.
  if (isLowGraphicsHardware(hints)) { return false; }
  // Missing APIs are not evidence of weak hardware (notably Safari/WKWebView).
  return true;
}

export function readDisplayPerformanceHints(): DisplayPerformanceHints {
  const hints: DisplayPerformanceHints = {};
  try {
    if (typeof navigator !== 'undefined') {
      hints.deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    }
  } catch { /* One restricted capability must not hide another. */ }
  try {
    if (typeof navigator !== 'undefined') {
      hints.hardwareConcurrency = navigator.hardwareConcurrency;
    }
  } catch { /* Restricted browser contexts can hide capability getters. */ }
  try {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      hints.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  } catch { /* Keep the ordinary default when media queries are unavailable. */ }
  return hints;
}
