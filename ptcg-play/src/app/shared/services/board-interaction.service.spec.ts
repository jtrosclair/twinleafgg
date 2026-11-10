import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from 'ptcg-server';
import { BoardInteractionService } from './board-interaction.service';

describe('board selection continuation lifecycle', () => {
  let service: BoardInteractionService;
  const target = (index: number): CardTarget => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
  const prompt = (id: number) => {
    const value = new ChoosePokemonPrompt(43, GameMessage.CHOOSE_POKEMON,
      PlayerType.BOTTOM_PLAYER, [SlotType.BENCH], { min: 1, max: 2 });
    value.id = id;
    return value;
  };

  beforeEach(() => { service = new BoardInteractionService(); });

  it('ends the confirmed selection before its callback creates the next prompt', () => {
    const nextPrompt = prompt(2);
    const nextCallback = jasmine.createSpy('next callback');
    const firstCallback = jasmine.createSpy('first callback').and.callFake((targets: CardTarget[]) => {
      expect(service.isSelectionActive()).toBe(false);
      expect(targets).toEqual([target(0)]);
      service.startBoardSelection(nextPrompt, nextCallback);
      service.toggleTarget(target(1));
    });
    service.startBoardSelection(prompt(1), firstCallback);
    service.toggleTarget(target(0));
    service.confirmSelection();

    expect(firstCallback.calls.count()).toBe(1);
    expect(service.isSelectionActive()).toBe(true);
    expect(service.isTargetSelected(target(1))).toBe(true);
    let currentPrompt: ChoosePokemonPrompt;
    service.prompt$.subscribe(value => currentPrompt = value).unsubscribe();
    expect(currentPrompt).toBe(nextPrompt);
    expect(nextCallback).not.toHaveBeenCalled();
    service.confirmSelection();
    expect(nextCallback).toHaveBeenCalledWith([target(1)]);
    expect(service.isSelectionActive()).toBe(false);
  });

  it('captures independent targets before teardown notifications mutate the old selection', () => {
    const selected = target(0);
    const callback = jasmine.createSpy('callback');
    service.startBoardSelection(prompt(1), callback);
    service.toggleTarget(selected);
    let oldTargets: CardTarget[];
    const targetsSubscription = service.selectedTargets$.subscribe(value => {
      if (value.length) { oldTargets = value; }
    });
    const teardownSubscription = service.selectionMode$.subscribe(active => {
      if (!active && oldTargets) {
        oldTargets[0].index = 4;
        oldTargets.push(target(3));
      }
    });
    service.confirmSelection();

    expect(callback).toHaveBeenCalledWith([target(0)]);
    const delivered = callback.calls.mostRecent().args[0];
    expect(delivered).not.toBe(oldTargets);
    expect(delivered[0]).not.toBe(selected);
    expect(service.isTargetSelected(target(4))).toBe(false);
    targetsSubscription.unsubscribe();
    teardownSubscription.unsubscribe();
  });

  it('ends a canceled selection before its callback creates the next prompt', () => {
    const nextCallback = jasmine.createSpy('next callback');
    const canceled = jasmine.createSpy('canceled').and.callFake((targets: CardTarget[]) => {
      expect(targets).toBeNull();
      expect(service.isSelectionActive()).toBe(false);
      service.startBoardSelection(prompt(2), nextCallback);
      service.toggleTarget(target(2));
    });
    service.startBoardSelection(prompt(1), canceled);
    service.toggleTarget(target(0));
    service.cancelSelection();

    expect(canceled.calls.count()).toBe(1);
    expect(service.isSelectionActive()).toBe(true);
    expect(service.isTargetSelected(target(2))).toBe(true);
    service.confirmSelection();
    expect(nextCallback).toHaveBeenCalledWith([target(2)]);
    expect(nextCallback.calls.count()).toBe(1);
  });

  it('does not invoke an ended selection callback or fabricate a callback while inactive', () => {
    service.confirmSelection();
    service.cancelSelection();
    const callback = jasmine.createSpy('callback');
    service.startBoardSelection(prompt(1), callback);
    service.toggleTarget(target(0));
    service.endBoardSelection();
    service.confirmSelection();
    service.cancelSelection();
    expect(callback).not.toHaveBeenCalled();
    expect(service.isSelectionActive()).toBe(false);
  });

  it('does not resolve the old callback twice when teardown observers confirm or cancel again', () => {
    const callback = jasmine.createSpy('callback');
    service.startBoardSelection(prompt(1), callback);
    service.toggleTarget(target(0));
    const subscription = service.selectionMode$.subscribe(active => {
      if (!active) { service.confirmSelection(); service.cancelSelection(); }
    });
    service.confirmSelection();
    service.confirmSelection();
    service.cancelSelection();
    expect(callback).toHaveBeenCalledWith([target(0)]);
    expect(callback.calls.count()).toBe(1);
    subscription.unsubscribe();
  });

  it('does not retain or duplicate the previous callback when it throws', () => {
    const callback = jasmine.createSpy('callback').and.throwError('Rejected continuation');
    service.startBoardSelection(prompt(1), callback);
    service.toggleTarget(target(0));
    expect(() => service.confirmSelection()).toThrowError('Rejected continuation');
    expect(service.isSelectionActive()).toBe(false);
    service.confirmSelection();
    service.cancelSelection();
    expect(callback.calls.count()).toBe(1);
  });
});
