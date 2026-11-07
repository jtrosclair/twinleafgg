/** Small, local diagnostics for measuring setup without recording puzzle data. */
interface SetupTiming {
  stages: { [stage: string]: number };
  startedAtNavigationMs?: number;
  navigationMs?: number;
}
let started = 0;
let current: SetupTiming | undefined;
let generation = 0;
const now = () => typeof performance === 'undefined' ? Date.now() : performance.now();

function expose(): void {
  if (typeof document !== 'undefined' && current) {
    document.documentElement.setAttribute('data-simulator-setup', JSON.stringify(current));
  }
}

export function beginPuzzleSetup(): number {
  started = now();
  current = { stages: {}, ...(typeof performance === 'undefined' ? {} : { startedAtNavigationMs: started }) };
  generation++;
  expose();
  return generation;
}

export function markPuzzleSetup(stage: string, expectedGeneration = generation): void {
  if (!current || expectedGeneration !== generation) { return; }
  current.stages[stage] = Math.round((now() - started) * 10) / 10;
  if (typeof performance !== 'undefined' && (stage === 'boardPainted' || current.stages.boardPainted === undefined)) {
    current.navigationMs = Math.round(performance.now() * 10) / 10;
  }
  expose();
}

export function currentSetupGeneration(): number { return generation; }
