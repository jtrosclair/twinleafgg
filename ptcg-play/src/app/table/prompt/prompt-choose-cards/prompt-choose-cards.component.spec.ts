import { CardType, ChooseCardsPrompt, EnergyCard, EnergyType, GameMessage, Player, PokemonCard,
  Stage, SuperType, TrainerCard, TrainerType } from 'ptcg-server';
import { PromptChooseCardsComponent } from './prompt-choose-cards.component';
import { of } from 'rxjs';

class Pokemon extends PokemonCard { name = 'Pokémon'; fullName = 'Pokémon TEST'; }
class Trainer extends TrainerCard { name = 'Trainer'; fullName = 'Trainer TEST'; }
class Energy extends EnergyCard { name = 'Energy'; fullName = 'Energy TEST'; }

describe('card selector', () => {
  let component: PromptChooseCardsComponent;
  let resolvePrompt: jasmine.Spy;
  let setPromptMinimized: jasmine.Spy;
  let showCardInfo: jasmine.Spy;
  let sources: any[];
  let targets: any[];
  let activeSource: any;

  function beginDrag(index: number): any {
    const slot = component.slotCards.findIndex(item => item?.index === index);
    activeSource = slot >= 0 ? component.slotSources[slot]
      : component.cardStacks.find(stack => stack.front.index === index)?.source;
    return activeSource ? activeSource.spec.beginDrag() : {
      data: component.promptItems.find(item => item.index === index), selected: false,
      promptId: component.prompt.id, localId: component.gameState.localId
    };
  }
  function endDrag(): void { activeSource?.spec.endDrag(); activeSource = undefined; }

  function load(cards: any[], options: any = {}, filter: any = {}): void {
    cards.forEach((card, index) => card.id = index + 10);
    const player = new Player();
    player.id = 1;
    player.hand.cards = cards;
    const prompt = new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, player.hand,
      filter, { min: 1, max: 2, allowCancel: false, ...options });
    component.prompt = prompt;
    component.gameState = { localId: 3, gameId: 4, deleted: false, state: { players: [player] } } as any;
    component.ngOnChanges({ prompt: { currentValue: prompt } } as any);
  }

  beforeEach(() => {
    resolvePrompt = jasmine.createSpy('resolvePrompt');
    setPromptMinimized = jasmine.createSpy('setPromptMinimized');
    showCardInfo = jasmine.createSpy('showCardInfo');
    sources = [];
    targets = [];
    const connect = (list: any[], spec: any) => {
      const connection = { spec, listen: () => of(false), unsubscribe: jasmine.createSpy('unsubscribe') };
      list.push(connection);
      return connection;
    };
    component = new PromptChooseCardsComponent({ resolvePrompt, setPromptMinimized } as any, { showCardInfo } as any,
      { dragSource: (_type, spec) => connect(sources, spec), dropTarget: (_type, spec) => connect(targets, spec) } as any);
  });

  it('keeps blocked copies unavailable even when they share a name with a valid copy', () => {
    load([new Pokemon(), new Pokemon(), new Trainer()], { blocked: [1] }, { superType: SuperType.POKEMON });
    expect(component.promptItems.map(item => item.index)).toEqual([0]);
    component.onTabChange('All', { scrollLeft: 20 } as HTMLElement);
    component.selectCard(component.promptItems[1]);
    component.selectCard(component.promptItems[2]);
    expect(component.selectedCards.length).toBe(0);
    expect(component.promptItems.map(item => item.isAvailable)).toEqual([true, false, false]);
  });

  it('selects physical copies independently and submits their original indices', () => {
    load([new Pokemon(), new Pokemon(), new Pokemon()], { min: 2 });
    component.selectCard(component.promptItems[1]);
    component.selectCard(component.promptItems[1]);
    component.selectCard(component.promptItems[0]);
    expect(component.selectedCards.map(item => item.index)).toEqual([1, 2]);
    expect(component.isInvalid).toBe(false);
    component.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(4, component.prompt.id, [1, 2]);
  });

  it('groups equivalent artwork prints, decrements one copy per click, and restores removed copies', () => {
    const alternate = Object.assign(new Pokemon(), { set: 'OTHER', fullName: 'Pokémon OTHER' });
    const different = Object.assign(new Pokemon(), { hp: 80 });
    load([new Pokemon(), alternate, new Pokemon(), different]);
    expect(component.cardStacks.length).toBe(2);
    expect(component.cardStacks[0].copies.map(item => item.index)).toEqual([0, 1, 2]);
    component.selectCard(component.cardStacks[0].front);
    expect(component.cardStacks[0].copies.length).toBe(2);
    expect(component.cardStacks[0].front.index).toBe(1);
    component.selectCard(component.cardStacks[0].front);
    expect(component.selectedCards.map(item => item.index)).toEqual([0, 1]);
    expect(component.cardStacks[0].copies.length).toBe(1);
    component.removeCard(component.selectedCards[0]);
    expect(component.cardStacks[0].copies.map(item => item.index)).toEqual([0, 2]);
    component.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(4, component.prompt.id, [1]);
  });

  it('puts an eligible copy in front of blocked copies in the All tab', () => {
    load([new Pokemon(), new Pokemon()], { blocked: [0] });
    expect(component.cardStacks[0].copies.length).toBe(1);
    component.onTabChange('All', { scrollLeft: 0 } as HTMLElement);
    expect(component.cardStacks[0].copies.length).toBe(2);
    expect(component.cardStacks[0].front.index).toBe(1);
    component.selectCard(component.cardStacks[0].front);
    expect(component.cardStacks[0].front.index).toBe(0);
    expect(component.canSelect(component.cardStacks[0].front)).toBe(false);
    component.selectCard(component.cardStacks[0].front);
    expect(component.selectedCards.map(item => item.index)).toEqual([1]);
  });

  it('preserves selection across filters and board inspection, then restores removed cards in order', () => {
    load([new Pokemon(), new Pokemon(), new Trainer()]);
    component.selectCard(component.promptItems[1]);
    component.onTabChange('All', { scrollLeft: 0 } as HTMLElement);
    expect(component.promptItems.map(item => item.index)).toEqual([0, 2]);
    component.toggleBoard();
    expect(setPromptMinimized).toHaveBeenCalledWith(3, true);
    component.minimized = true;
    component.ngOnChanges({ minimized: { currentValue: true } } as any);
    component.toggleBoard();
    expect(setPromptMinimized).toHaveBeenCalledWith(3, false);
    expect(component.selectedCards.map(item => item.index)).toEqual([1]);
    component.removeCard(component.selectedCards[0]);
    expect(component.promptItems.map(item => item.index)).toEqual([0, 1, 2]);
    component.confirm();
    expect(resolvePrompt).not.toHaveBeenCalled();
  });

  it('allows an optional empty search, including an explicit zero-card maximum', () => {
    load([new Pokemon()], { min: 0, max: 0 });
    expect(component.slots).toEqual([]);
    component.selectCard(component.promptItems[0]);
    expect(component.selectedCards).toEqual([]);
    component.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(4, component.prompt.id, []);
  });

  it('keeps secret cards separate and shows only face-down details', () => {
    load([new Pokemon(), new Pokemon()], { isSecret: true });
    expect(component.cardStacks.length).toBe(2);
    expect(component.cardStacks.every(stack => stack.copies.length === 1)).toBe(true);
    expect(component.showTabs).toBe(false);
    expect(component.cardName(component.promptItems[0])).toBe('Face-down card 1');
    component.showCardInfo(component.promptItems[0]);
    expect(showCardInfo).toHaveBeenCalledWith({ card: component.promptItems[0].card, facedown: true });
  });

  it('revalidates before confirming and never submits actions for deleted games', () => {
    load([new Pokemon()], { max: 1, allowCancel: true });
    component.selectCard(component.promptItems[0]);
    component.gameState.deleted = true;
    component.confirm();
    component.cancel();
    expect(resolvePrompt).not.toHaveBeenCalled();
  });

  it('opens details on tap without selecting, then moves exactly one copy on drop', () => {
    load([new Pokemon(), new Pokemon()]);
    const item = component.cardStacks[0].front;
    component.showCardInfo(item);
    expect(showCardInfo).toHaveBeenCalledWith({ card: item.card, facedown: false });
    expect(component.selectedCards).toEqual([]);
    const drag = beginDrag(0);
    component.dropCard(drag, true, 1);
    expect(component.slotCards[0]).toBeUndefined();
    expect(component.slotCards[1]).toBe(item);
    expect(component.cardStacks[0].copies.length).toBe(1);
    expect(component.selectedCards.map(card => card.index)).toEqual([0]);
    endDrag();
    component.showCardInfo(item);
    expect(showCardInfo.calls.count()).toBe(1);
    const returning = beginDrag(0);
    component.dropCard(returning, false);
    endDrag();
    expect(component.selectedCards.length).toBe(0);
    expect(component.cardStacks[0].copies.length).toBe(2);
  });

  it('does not select on a cancelled drag and allows moving or swapping selected slots', () => {
    load([new Pokemon(), new Pokemon()]);
    beginDrag(0);
    endDrag();
    expect(component.selectedCards.length).toBe(0);
    component.dropCard(beginDrag(0), true, 1);
    endDrag();
    component.dropCard(beginDrag(0), true, 0);
    endDrag();
    expect(component.slotCards[0].index).toBe(0);
    expect(component.slotCards[1]).toBeUndefined();
    component.dropCard(beginDrag(1), true, 1);
    endDrag();
    component.dropCard(beginDrag(1), true, 0);
    endDrag();
    expect(component.selectedCards.map(card => card.index)).toEqual([1, 0]);
  });

  it('labels Secret Box slots and accepts each trainer only in its matching slot', () => {
    const trainers = [TrainerType.ITEM, TrainerType.TOOL, TrainerType.SUPPORTER, TrainerType.STADIUM, TrainerType.ITEM]
      .map(trainerType => Object.assign(new Trainer(), { trainerType }));
    load(trainers, { min: 0, max: 4, maxItems: 1, maxTools: 1, maxSupporters: 1, maxStadiums: 1 });
    expect(component.slotRules.map(rule => rule.label)).toEqual(['Item', 'Pokémon Tool', 'Supporter', 'Stadium']);
    expect(component.isInvalid).toBe(false);
    expect(component.prompt.options.min).toBe(0);
    const item = beginDrag(0);
    expect(component.canDropCard(item, true, 1)).toBe(false);
    component.dropCard(item, true, 1);
    expect(component.selectedCards.length).toBe(0);
    // Dropping into the general tray finds the matching slot, even when it isn't first.
    component.dropCard(beginDrag(2), true);
    endDrag();
    expect(component.slotCards[2].index).toBe(2);
    component.dropCard(beginDrag(0), true);
    endDrag();
    expect(component.slotCards[0].index).toBe(0);
    expect(component.canSelect(component.promptItems.find(card => card.index === 4))).toBe(false);
    expect(component.canDropCard(beginDrag(2), true, 0)).toBe(false);
    endDrag();
    component.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(4, component.prompt.id, [0, 2]);
  });

  it('does not reroute an incorrect slot drop through the parent tray', () => {
    load([new Trainer(), Object.assign(new Trainer(), { trainerType: TrainerType.TOOL })],
      { min: 0, max: 2, maxItems: 1, maxTools: 1 });
    const drag = beginDrag(0);
    const traySpec = (component.trayTarget as any).spec;
    traySpec.drop({ didDrop: () => false, getItem: () => drag, isOver: () => false });
    expect(component.selectedCards.length).toBe(0);
    traySpec.drop({ didDrop: () => false, getItem: () => drag, isOver: () => true });
    expect(component.slotCards[0].index).toBe(0);
  });

  it('omits unavailable Secret Box categories and allows an empty optional result', () => {
    load([new Trainer(), Object.assign(new Trainer(), { trainerType: TrainerType.TOOL })],
      { min: 0, max: 2, maxItems: 1, maxTools: 1, maxSupporters: 0, maxStadiums: 0 });
    expect(component.slotRules.map(rule => rule.label)).toEqual(['Item', 'Pokémon Tool']);
    component.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(4, component.prompt.id, []);
  });

  it('labels unrestricted and restricted discards and enforces filters before reaching the minimum', () => {
    load([new Pokemon(), new Trainer()], { min: 2 });
    component.prompt.message = GameMessage.CHOOSE_CARD_TO_DISCARD;
    expect(component.slotRules.map(rule => rule.label)).toEqual(['any', 'any']);
    component.selectCard(component.promptItems[0]);
    expect(component.selectedCards.length).toBe(1);
    expect(component.isInvalid).toBe(true);
    expect(component.prompt.options.min).toBe(2);
    const basic = Object.assign(new Energy(), { energyType: EnergyType.BASIC });
    const special = Object.assign(new Energy(), { energyType: EnergyType.SPECIAL });
    load([basic, special, new Pokemon()], { min: 1, max: 1 },
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC });
    component.prompt.message = GameMessage.CHOOSE_ENERGY_TO_DISCARD;
    expect(component.slotRules[0].label).toBe('Basic Energy');
    component.onTabChange('All', { scrollLeft: 0 } as HTMLElement);
    expect(component.canDropCard(beginDrag(1), true, 0)).toBe(false);
    endDrag();
    component.dropCard(beginDrag(0), true, 0);
    expect(component.isInvalid).toBe(false);
    load([new Pokemon()], { max: 1 }, { superType: SuperType.POKEMON, stage: Stage.BASIC });
    expect(component.slotRules[0].label).toBe('Basic Pokémon');
    load([new Trainer()], { max: 1 }, { trainerType: TrainerType.SUPPORTER });
    expect(component.slotRules[0].label).toBe('Supporter');
  });

  it('splits independent supertype limits without forcing every slot to be filled', () => {
    load([new Pokemon(), new Energy(), new Trainer()],
      { min: 0, max: 3, maxPokemons: 1, maxEnergies: 1, maxTrainers: 1 });
    expect(component.slotRules.map(rule => rule.label)).toEqual(['Pokémon', 'Energy', 'Trainer']);
    component.selectCard(component.promptItems[1]);
    expect(component.slotCards[1].index).toBe(1);
    expect(component.isInvalid).toBe(false);
  });

  it('keeps broad labels for either/or and different-type rules but rejects invalid combinations', () => {
    const basic = Object.assign(new Pokemon(), { stage: Stage.BASIC, cardType: CardType.FIRE });
    const evolution = Object.assign(new Pokemon(), { stage: Stage.STAGE_1 });
    load([basic, evolution], { maxBasics: 2, maxEvolutions: 1, max: 3 }, { superType: SuperType.POKEMON });
    expect(component.slotRules.map(rule => rule.label)).toEqual(['Pokémon', 'Pokémon', 'Pokémon']);
    component.selectCard(component.promptItems[0]);
    expect(component.canSelect(component.promptItems[0])).toBe(false);
    load([basic, Object.assign(new Pokemon(), { cardType: CardType.FIRE }),
      Object.assign(new Pokemon(), { cardType: CardType.WATER })], { differentTypes: true, min: 2 });
    component.selectCard(component.promptItems[0]);
    expect(component.canSelect(component.promptItems[0])).toBe(false);
    expect(component.canSelect(component.promptItems[1])).toBe(true);
    component.selectCard(component.promptItems[1]);
    expect(component.isInvalid).toBe(false);
  });

  it('rejects stale, blocked, minimized, and over-limit drops', () => {
    load([new Pokemon(), new Pokemon()], { max: 1, blocked: [1] });
    const drag = beginDrag(0);
    expect(component.canDropCard({ ...drag, promptId: 999 }, true)).toBe(false);
    component.minimized = true;
    component.dropCard(drag, true);
    expect(component.selectedCards.length).toBe(0);
    component.minimized = false;
    component.onTabChange('All', { scrollLeft: 0 } as HTMLElement);
    component.dropCard(beginDrag(1), true);
    expect(component.selectedCards.length).toBe(0);
    component.dropCard(drag, true);
    expect(component.selectedCards.length).toBe(1);
    expect(component.canDropCard(drag, true)).toBe(false);
    load([new Pokemon()]);
    expect(component.canDropCard(drag, true)).toBe(false);
    expect(sources[0].unsubscribe).toHaveBeenCalled();
    component.ngOnDestroy();
    expect(targets.every(target => target.unsubscribe.calls.count() > 0)).toBe(true);
  });

  it('reserves horizontal touch gestures for scrolling and suppresses their trailing tap', () => {
    load([new Pokemon()]);
    const stopPropagation = jasmine.createSpy('stopPropagation');
    component.onTouchStart({ touches: [{ clientX: 100, clientY: 100 }] } as any);
    component.onTouchMove({ touches: [{ clientX: 30, clientY: 104 }], stopPropagation } as any);
    component.onTouchEnd();
    component.showCardInfo(component.promptItems[0]);
    expect(stopPropagation).toHaveBeenCalled();
    expect(showCardInfo).not.toHaveBeenCalled();
    expect(component.selectedCards.length).toBe(0);
  });

  it('requires an Active slot during setup and submits Active before Benched cards', () => {
    load([new Pokemon(), new Pokemon()]);
    component.prompt.message = GameMessage.CHOOSE_STARTING_POKEMONS;
    component.ngOnChanges({ prompt: { currentValue: component.prompt } } as any);
    component.dropCard(beginDrag(0), true, 2);
    endDrag();
    expect(component.isInvalid).toBe(true);
    component.confirm();
    expect(resolvePrompt).not.toHaveBeenCalled();
    component.dropCard(beginDrag(1), true, 0);
    endDrag();
    component.confirm();
    expect(resolvePrompt).toHaveBeenCalledWith(4, component.prompt.id, [1, 0]);
  });

  it('keeps the selected layout until Inspect Board finishes fading and preserves the cards on return', () => {
    load([new Pokemon()]);
    component.selectCard(component.promptItems[0]);
    component.minimized = true;
    component.ngOnChanges({ minimized: { currentValue: true } } as any);
    expect(component.boardView).toBe(false);
    component.showCardInfo(component.selectedCards[0]);
    component.confirm();
    expect(showCardInfo).not.toHaveBeenCalled();
    expect(resolvePrompt).not.toHaveBeenCalled();
    component.onVisibilityDone({ toState: 'hidden' } as any);
    expect(component.boardView).toBe(true);
    component.minimized = false;
    component.ngOnChanges({ minimized: { currentValue: false } } as any);
    expect(component.boardView).toBe(false);
    expect(component.selectedCards.map(item => item.index)).toEqual([0]);
  });

  it('ignores a stale fade-out completion when the player has already returned to selection', () => {
    load([new Pokemon()]);
    component.minimized = true;
    component.ngOnChanges({ minimized: { currentValue: true } } as any);
    component.minimized = false;
    component.ngOnChanges({ minimized: { currentValue: false } } as any);
    component.onVisibilityDone({ toState: 'hidden' } as any);
    expect(component.boardView).toBe(false);
  });
});
