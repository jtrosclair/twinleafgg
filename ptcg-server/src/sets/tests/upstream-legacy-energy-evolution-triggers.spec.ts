import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GamePhase } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const board = { ...active, slot: SlotType.BOARD };
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const psychic = 'Psychic Energy SVE';
const metal = 'Metal Energy SVE';
const lightning = 'Lightning Energy SVE';
const rainbow = 'Rainbow Energy SUM';
const finneon = 'Finneon MT';
const flareon = 'Flareon AOR';
const leafeon = 'Leafeon PLF';
const jolteon = 'Jolteon AOR';
const neo = 'Eevee N2';
const sunMoon = 'Eevee SUM';
const furiousFists = 'Eevee FFI';
const beldum = 'Beldum LA';
const vileplume = 'Vileplume LA';

describe('Printed Energy Evolution, Metal Chain and Energy Reaction triggers', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: SetupGameConfig['player1'], player2: SetupGameConfig['player2'] = { active: { card: finneon } }) {
    const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...player1 },
      player2: { deck: padDeck(8), ...player2 } });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return game;
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Missing pending prompt');
    const result = prompt.decode(raw, store.state);
    if (!prompt.validate(result, store.state)) throw new Error(`Invalid test result for ${prompt.type}`);
    store.dispatch(new ResolvePromptAction(prompt.id, result));
  }

  function shuffle(order: number[]) {
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve(order);
  }

  function choose(name: string) {
    const prompt = pending() as ChooseCardsPrompt;
    expect(prompt instanceof ChooseCardsPrompt).toBe(true);
    resolve([prompt.cards.cards.findIndex(card => card.fullName === name)]);
  }

  for (const eevee of [furiousFists, sunMoon]) {
    it(`lets ${eevee} decline the search and evolves its actual Bench slot when accepted`, () => {
      const { player1 } = open({ active: { card: finneon }, bench: [{ card: eevee }],
        hand: [fire, fire], deck: [flareon, leafeon, grass] });
      const originalDeck = player1.deck.cards.slice();
      const target = player1.bench[0];
      store.dispatch(new PlayCardAction(player1.id, 0, bench));
      expect(pending() instanceof ConfirmPrompt).toBe(true);
      resolve(false);
      expect(player1.deck.cards).toEqual(originalDeck);
      expect(pending()).toBeUndefined();

      store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.hand.cards[0] as EnergyCard, target));
      resolve(true);
      expect(pending() instanceof ChooseCardsPrompt).toBe(true);
      const search = pending() as ChooseCardsPrompt;
      const wrongType = search.cards.cards.findIndex(card => card.fullName === leafeon);
      expect(search.validate(search.decode([wrongType]))).toBe(false);
      choose(flareon);
      expect(target.cards).toContain(originalDeck[0]);
      expect(target.energies.cards.length).toBe(2);
      expect(player1.active.getPokemonCard()?.fullName).toBe(finneon);
      shuffle([1, 0]);
      expect(player1.deck.cards).toEqual([originalDeck[2], originalDeck[1]]);
    });

    it(`shuffles after ${eevee} accepts and fails to find an evolution`, () => {
      const { player1 } = open({ active: { card: eevee }, hand: [fire], deck: [leafeon, grass] });
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      resolve(true);
      resolve([]);
      shuffle([1, 0]);
      expect(player1.active.getPokemonCard()?.fullName).toBe(eevee);
      expect(player1.deck.cards.map(card => card.fullName)).toEqual([grass, leafeon]);
    });
  }

  it('waits for Welder to finish attaching and drawing before Energy Evolution', () => {
    const { player1 } = open({ active: { card: sunMoon }, hand: ['Welder UNB', fire, fire],
      deck: [grass, grass, grass, flareon] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(pending() instanceof AttachEnergyPrompt).toBe(true);
    resolve([{ index: 0, to: active }, { index: 1, to: active }]);
    expect(player1.active.energies.cards.length).toBe(2);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass, grass, grass]);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    choose(flareon);
    shuffle([]);
    expect(pending()).toBeUndefined();
  });

  it('lets the player order Energy Evolution before the Arctozolt reaction', () => {
    const { player1 } = open({ active: { card: sunMoon }, hand: [fire], deck: [flareon] },
      { active: { card: 'Arctozolt DAA' } });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    const order = pending() as SelectPrompt;
    expect(order instanceof SelectPrompt).toBe(true);
    expect(order.playerId).toBe(player1.id);
    expect(order.values).toContain('Biting Whirlpool');
    resolve(order.values.indexOf('Energy Evolution'));
    resolve(true);
    choose(flareon);
    shuffle([]);
    expect(player1.active.getPokemonCard()?.fullName).toBe(flareon);
    expect(player1.active.damage).toBe(0);
  });

  it('lets Neo Eevee evolve on the Bench after Dynamotor attaches from the discard', () => {
    const { player1 } = open({ active: { card: 'Eelektrik NVI' }, bench: [{ card: neo }],
      discard: [lightning], deck: [jolteon, flareon] });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new UseAbilityAction(player1.id, 'Dynamotor', active));
    expect(pending() instanceof AttachEnergyPrompt).toBe(true);
    resolve([{ index: 0, to: bench }]);
    expect(pending() instanceof WaitPrompt).toBe(true);
    expect(player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([lightning]);
    resolve(true);
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    choose(jolteon);
    shuffle([0]);
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(jolteon);
  });

  it('skips the Neo deck search on tails', () => {
    const { player1 } = open({ active: { card: neo }, hand: [fire], deck: [flareon] });
    spyOn(Math, 'random').and.returnValue(0.9);
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(pending() instanceof WaitPrompt).toBe(true);
    resolve(true);
    expect(pending()).toBeUndefined();
    expect(player1.deck.cards.map(card => card.fullName)).toEqual([flareon]);
  });

  it('lets Neo Eevee search any matching evolution after Rainbow Energy attaches from the deck', () => {
    const { player1 } = open({ active: { card: neo }, deck: [rainbow, leafeon, flareon] });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.deck.cards[0] as EnergyCard, player1.active, 'deck'));
    expect(pending() instanceof WaitPrompt).toBe(true);
    expect(player1.active.damage).toBe(0);
    resolve(true);
    choose(leafeon);
    shuffle([0]);
    expect(player1.active.getPokemonCard()?.fullName).toBe(leafeon);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([rainbow]);
  });

  it('lets Beldum decline without using Metal Chain and then put a real Beldum onto the Bench', () => {
    const { player1 } = open({ active: { card: beldum }, hand: [metal, metal, metal], deck: [beldum, fire] });
    const [chosen] = player1.deck.cards;
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.hand.cards[0] as EnergyCard, player1.active));
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    choose(beldum);
    shuffle([0]);
    expect(player1.bench[0].cards).toContain(chosen);
    store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.hand.cards[0] as EnergyCard, player1.active));
    expect(pending()).toBeUndefined();
  });

  it('does not offer Metal Chain while Beldum has a Special Condition', () => {
    const { player1 } = open({ active: { card: beldum }, hand: [metal], deck: [beldum] });
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(pending()).toBeUndefined();
  });

  for (const [energy, condition] of [[grass, SpecialCondition.ASLEEP], [psychic, SpecialCondition.POISONED]] as const) {
    it(`lets Vileplume choose whether to apply ${condition}`, () => {
      const { player1, player2 } = open({ active: { card: vileplume }, hand: [energy, energy] });
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      expect(pending() instanceof ConfirmPrompt).toBe(true);
      expect(player2.active.specialConditions).toEqual([]);
      resolve(false);
      expect(player2.active.specialConditions).toEqual([]);
      store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.hand.cards[0] as EnergyCard, player1.active));
      resolve(true);
      expect(player2.active.specialConditions).toEqual([condition]);
    });
  }

  it('does not offer Energy Reaction after the Nurture and Heal Poké-Power', () => {
    const { player1, player2 } = open({ active: { card: 'Meganium ex UF' },
      bench: [{ card: vileplume, damage: 20 }], hand: [grass] });
    store.dispatch(new UseAbilityAction(player1.id, 'Nurture and Heal', active));
    expect(pending() instanceof AttachEnergyPrompt).toBe(true);
    resolve([{ index: 0, to: bench }]);
    expect(player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([grass]);
    expect(player1.bench[0].damage).toBe(10);
    expect(player2.active.specialConditions).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  it('does offer Energy Reaction after the Spring Bloom Ability', () => {
    const { player1, player2 } = open({ active: { card: 'Cherrim BST' }, bench: [{ card: vileplume }], hand: [grass] });
    store.dispatch(new UseAbilityAction(player1.id, 'Spring Bloom', active));
    expect(pending() instanceof AttachEnergyPrompt).toBe(true);
    resolve([{ index: 0, to: bench }]);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(player2.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });

  it('does not offer Energy Reaction for an attachment during an attack', () => {
    const { player1 } = open({ active: { card: vileplume }, hand: [grass] });
    store.state.phase = GamePhase.ATTACK;
    store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.hand.cards[0] as EnergyCard, player1.active));
    expect(player1.active.energies.cards.length).toBe(1);
    expect(pending()).toBeUndefined();
  });

  it('lets Energy Reaction apply through protection that only covers attack effects', () => {
    const { player1, player2 } = open({ active: { card: vileplume }, hand: [psychic] });
    player2.active.preventEffectsOfAttacksNextTurn = true;
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(player2.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('locks all four Trainer classes on Disturbing Pollen heads and leaves Energy available', () => {
    const { player1, player2 } = open({ active: { card: vileplume, energy: [psychic, grass, fire] } },
      { active: { card: 'Mew ex MEW' }, hand: [fire] });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Disturbing Pollen'));
    expect((pending() as WaitPrompt)?.message).toBe('Coin flip animation');
    resolve(true);
    expect((pending() as WaitPrompt)?.message).toBe('Attack animation');
    resolve(true);
    for (const marker of [player2.ATTACK_EFFECT_ITEM_LOCK, player2.ATTACK_EFFECT_TOOL_LOCK,
      player2.ATTACK_EFFECT_SUPPORTER_LOCK, player2.ATTACK_EFFECT_STADIUM_LOCK]) {
      expect(player2.marker.hasMarker(marker)).toBe(true);
    }
    expect(player2.active.damage).toBe(60);
    expect(player2.energyCardsBlockedNextTurn).toBe(false);
  });
});
