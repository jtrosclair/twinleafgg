import { PromptComponent } from './prompt.component';

describe('prompt restoration lifecycle', () => {
  let component: PromptComponent;
  let callbacks: Array<() => void>;
  let previousWindow: PropertyDescriptor | undefined;
  let detectChanges: jasmine.Spy;

  beforeEach(() => {
    callbacks = [];
    previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {
      setTimeout: (callback: () => void) => { callbacks.push(callback); }
    } });
    detectChanges = jasmine.createSpy('detectChanges');
    component = new PromptComponent({ setPromptMinimized: () => {} } as any, { detectChanges } as any);
    component.clientId = 43;
  });

  afterEach(() => {
    if (previousWindow) { Object.defineProperty(globalThis, 'window', previousWindow); }
    else { delete (globalThis as any).window; }
  });

  function update(prompts: any[]): void {
    const previousValue = component.gameState;
    component.gameState = { localId: 1, promptMinimized: false, state: { prompts } } as any;
    component.ngOnChanges({ gameState: { previousValue } } as any);
  }

  function prompt(id: number): any { return { id, playerId: 43, type: 'Confirm', result: undefined }; }
  function flush(): void { callbacks.splice(0).forEach(callback => callback()); }

  it('does not resurrect a queued prompt after resetting to a board without prompts', () => {
    update([prompt(1)]);
    expect(callbacks.length).toBe(1);
    update([]);
    flush();
    expect(component.prompt).toBeUndefined();
    expect(component.animationState).toBe('exit');
    expect(detectChanges).not.toHaveBeenCalled();
  });

  it('shows only the latest prompt when a new attempt reuses a prompt ID', () => {
    const oldPrompt = prompt(1), newPrompt = prompt(1);
    update([oldPrompt]);
    update([]);
    update([newPrompt]);
    flush();
    expect(component.prompt).toBe(newPrompt);
    expect(component.isPromptVisible).toBe(true);
    expect(detectChanges.calls.count()).toBe(1);
  });

  it('keeps the latest prompt scheduled when another state update arrives before display', () => {
    update([prompt(1)]);
    const latest = prompt(1);
    update([latest]);
    flush();
    expect(component.prompt).toBe(latest);
    expect(detectChanges.calls.count()).toBe(1);
  });

  it('replaces a displayed board prompt when a subsequent card prompt reuses its ID', () => {
    const boardPrompt = { ...prompt(1), type: 'Choose pokemon' };
    update([boardPrompt]);
    flush();
    expect(component.prompt).toBe(boardPrompt);
    component.minimized = true;
    const cardPrompt = { ...prompt(1), type: 'Choose cards' };
    update([cardPrompt]);
    expect(component.prompt).toBeUndefined();
    flush();
    expect(component.prompt).toBe(cardPrompt);
    expect(component.minimized).toBe(false);
    expect(component.isPromptVisible).toBe(true);
    expect(detectChanges.calls.count()).toBe(2);
  });

  it('does not run a pending view callback after the prompt component is destroyed', () => {
    update([prompt(1)]);
    component.ngOnDestroy();
    flush();
    expect(component.prompt).toBeUndefined();
    expect(detectChanges).not.toHaveBeenCalled();
  });
});
