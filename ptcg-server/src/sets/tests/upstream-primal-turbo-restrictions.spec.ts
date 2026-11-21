import { ensureClientCards } from '../../client/cards';
import { PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AddSpecialConditionsPowerEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyEffect, AttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const board = { ...active, slot: SlotType.BOARD };
const archeops = 'Archeops SIT';
const lugia = 'Lugia V SIT';
const lugiaStar = 'Lugia VSTAR SIT';
const neo = 'Eevee N2';
const flareon = 'Flareon AOR';
const finneon = 'Finneon MT';
const rainbow = 'Rainbow Energy SUM';
const ignition = 'Ignition Energy SV11W';
const triple = 'Triple Acceleration Energy UNB';
const boost = 'Boost Energy AQ';
const single = 'Single Strike Energy BST';
const temple = 'Temple of Sinnoh ASR';
const festival = 'Festival Grounds TWM';
const fire = 'Fire Energy SVE';
const basic = 'Grass Energy SVE';

describe('Special Energy attachment restrictions and Primal Turbo', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: SetupGameConfig['player1'], player2: SetupGameConfig['player2'] = { active: { card: finneon } }) {
    store?.cleanup();
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
    const decoded = prompt.decode(raw, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid test result for ${prompt.type}`);
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function attach(...assignments: [string, CardTarget][]) {
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt instanceof AttachEnergyPrompt).toBe(true);
    resolve(assignments.map(([name, to]) => ({
      index: prompt.cardList.cards.findIndex(card => card.fullName === name), to,
    })));
  }

  function shuffle(order: number[]) {
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve(order);
  }

  const restricted = [
    'Aqua Energy MA', boost, 'Burning Energy BKT', 'Dangerous Energy AOR',
    'Double Dragon Energy ROS', 'Double Rainbow Energy MA', 'Flash Energy AOR', 'Fusion Strike Energy FST',
    'Herbal Energy FFI', 'Impact Energy CRE', 'Magma Energy MA', 'Mystery Energy PHF', 'R Energy TRR',
    'Rapid Strike Energy BST', 'Scramble Energy DX', 'Shield Energy PRC', single, 'Spiral Energy CRE',
    'Splash Energy BKP', 'Strong Energy FFI', "Team Rocket's Energy DRI", triple, 'Wonder Energy PRC',
  ];

  for (const energy of restricted) {
    it(`rejects a manual ${energy} attachment to an ineligible Pokémon without spending the attachment`, () => {
      const { player1 } = open({ active: { card: lugia }, hand: [energy, fire] });
      expect(() => store.dispatch(new PlayCardAction(player1.id, 0, active))).toThrow();
      const owner = store.state.players[0];
      expect(owner.hand.cards.map(card => card.fullName)).toEqual([energy, fire]);
      expect(owner.active.energies.cards).toEqual([]);
      expect(owner.energyPlayedTurn).not.toBe(5);
      expect(pending()).toBeUndefined();
    });

    it(`lets Primal Turbo attach and then discard incompatible ${energy}`, () => {
      const { player1 } = open({ active: { card: lugia }, bench: [{ card: archeops }],
        deck: [energy, basic, fire] });
      const [chosen, first, second] = player1.deck.cards;
      store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
      attach([energy, active]);
      expect(player1.active.energies.cards).toEqual([chosen]);
      expect(player1.discard.cards).toEqual([]);
      shuffle([1, 0]);
      expect(player1.deck.cards).toEqual([second, first]);
      expect(player1.active.energies.cards).toEqual([]);
      expect(player1.active.cards).not.toContain(chosen);
      expect(player1.discard.cards).toContain(chosen);
      expect(player1.marker.markers.some(marker => marker.source === chosen)).toBe(false);
      expect(player1.energyPlayedTurn).not.toBe(5);
    });
  }

  it('uses Crazy Code from the hand and discards incompatible Triple Acceleration Energy', () => {
    const { player1 } = open({ active: { card: lugia }, bench: [{ card: 'Porygon-Z UNB' }],
      hand: [triple, fire] });
    store.dispatch(new UseAbilityAction(player1.id, 'Crazy Code', bench));
    attach([triple, active]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([triple]);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([fire]);
    expect(player1.active.energies.cards).toEqual([]);
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([fire]);
  });

  it('uses the correct origin when Slimy Room requires a preflight and a coin flip for Crazy Code', () => {
    const { player1 } = open({ active: { card: lugia }, bench: [{ card: 'Porygon-Z UNB' }],
      hand: [single] }, { active: { card: 'Goodra FST 197' } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new UseAbilityAction(player1.id, 'Crazy Code', bench));
    attach([single, active]);
    expect(pending() instanceof WaitPrompt).toBe(true);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([single]);
    resolve(true);
    expect(player1.hand.cards).toEqual([]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([single]);
    expect(player1.active.energies.cards).toEqual([]);
  });

  it('does not let Primarina’s extra manual attachment bypass an Energy restriction', () => {
    const { player1 } = open({ active: { card: lugia }, bench: [{ card: 'Primarina LOT' }],
      hand: [fire, single] });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([fire]);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([single]);
    expect(pending()).toBeUndefined();
  });

  it('uses a classic name restriction while allowing a genuine Dark Pokémon to keep R Energy', () => {
    const { player1 } = open({ active: { card: 'Dark Tyranitar TRR 19' }, hand: ['R Energy TRR'] });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    const query = new CheckProvidedEnergyEffect(player1, player1.active);
    store.reduceEffect(store.state, query);
    expect(query.energyMap.map(entry => entry.provides)).toEqual([[CardType.DARK, CardType.DARK]]);
    store.dispatch(new PassTurnAction(player1.id));
    expect(player1.discard.cards.map(card => card.fullName)).toEqual(['R Energy TRR']);
  });

  it('honors a changed Pokémon type when a player attaches Splash Energy manually', () => {
    const splash = 'Splash Energy BKP';
    const { player1 } = open({ active: { card: 'Silvally-GX CIN', tools: ['Water Memory TEU'] }, hand: [splash] });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([splash]);
  });

  it('reveals a genuine Eevee reaction after both selected cards and Primal Turbo’s shuffle finish', () => {
    const { player1 } = open({ active: { card: neo }, bench: [{ card: archeops }],
      deck: [rainbow, ignition, flareon, fire] });
    spyOn(Math, 'random').and.returnValues(0.1, 0.9);
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
    attach([rainbow, active], [ignition, active]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([rainbow, ignition]);
    expect(player1.active.damage).toBe(0);
    shuffle([1, 0]);
    const order = pending() as { values?: string[] };
    const rainbowOption = order.values?.findIndex(value => value.includes('Rainbow Energy')) ?? -1;
    expect(rainbowOption).toBeGreaterThanOrEqual(0);
    resolve(rainbowOption);
    resolve(true);
    const search = pending() as ChooseCardsPrompt;
    expect(search instanceof ChooseCardsPrompt).toBe(true);
    resolve([search.cards.cards.findIndex(card => card.fullName === flareon)]);
    shuffle([0]);
    expect(player1.active.getPokemonCard()?.fullName).toBe(flareon);
    expect(player1.active.damage).toBe(0);
    expect(pending()).toBeUndefined();
  });

  it('attaches Legacy Energy from the deck through Genesect’s Ace Canceller', () => {
    const legacy = 'Legacy Energy TWM';
    const { player1 } = open({ active: { card: lugiaStar }, bench: [{ card: archeops }],
      deck: [legacy, fire] }, { active: { card: 'Genesect SFA' } });
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
    attach([legacy, active]);
    shuffle([0]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([legacy]);
  });

  it('discards an incompatible Energy before a triggered evolution can make its recipient eligible', () => {
    const { player1 } = open({ active: { card: neo }, bench: [{ card: archeops }],
      deck: [triple, rainbow, flareon, fire] });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
    attach([rainbow, active], [triple, active]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([rainbow, triple]);
    shuffle([1, 0]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([triple]);
    expect(pending() instanceof WaitPrompt).toBe(true);
    resolve(true);
    const search = pending() as ChooseCardsPrompt;
    resolve([search.cards.cards.findIndex(card => card.fullName === flareon)]);
    shuffle([0]);
    expect(player1.active.getPokemonCard()?.fullName).toBe(flareon);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([rainbow]);
  });

  it('leaves incompatible Energy attached while its discard effect is suppressed', () => {
    const doubleRainbow = 'Double Rainbow Energy MA';
    const { player1, player2 } = open({ active: { card: lugia }, bench: [{ card: archeops }],
      hand: [temple], deck: [doubleRainbow, fire] }, { active: { card: finneon }, hand: ['Training Court RCL'] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
    attach([doubleRainbow, active]);
    shuffle([0]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([doubleRainbow]);
    store.dispatch(new PassTurnAction(player1.id));
    store.dispatch(new PlayCardAction(player2.id, 0, board));
    expect(player1.active.energies.cards).toEqual([]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(doubleRainbow);
  });

  for (const energy of [triple, boost]) {
    it(`does not defer an expired ${energy} discard to a later turn after suppression lifts`, () => {
      const { player1, player2 } = open({ active: { card: lugia }, bench: [{ card: archeops }],
        hand: [temple, lugiaStar], deck: [energy, fire] }, { active: { card: finneon }, hand: ['Training Court RCL'] });
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
      attach([energy, active]);
      shuffle([0]);
      const attached = player1.active.energies.cards[0];
      expect(attached?.fullName).toBe(energy);
      store.dispatch(new PassTurnAction(player1.id));
      expect(player1.active.energies.cards).toContain(attached);
      expect(player1.marker.markers.some(marker => marker.source === attached)).toBe(false);
      store.dispatch(new PlayCardAction(player2.id, 0, board));
      store.dispatch(new PassTurnAction(player2.id));
      expect(player1.active.energies.cards).toContain(attached);
      expect(player1.discard.cards).not.toContain(attached);
    });
  }

  it('recovers from Poison at Festival Grounds when mismatched Single Strike Energy attaches to Lugia VSTAR', () => {
    const { player1 } = open({ active: { card: lugiaStar }, bench: [{ card: archeops }],
      hand: [festival], deck: [single, fire] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
    attach([single, active]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([single]);
    shuffle([0]);
    expect(player1.active.specialConditions).toEqual([]);
    expect(player1.active.energies.cards).toEqual([]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([single]);
  });

  it('prevents Special Conditions only on Pokémon affected by Festival Grounds', () => {
    const { player1, player2 } = open({
      active: { card: lugia, energy: [fire] }, hand: [festival],
      bench: [{ card: 'Lunatone OBF' }, { card: 'Solrock PGO' }],
    }, { active: { card: finneon, energy: [basic] } });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.reduceEffect(store.state, new AddSpecialConditionsPowerEffect(player2, player2.active.getPokemonCard()!,
      player1.active, [SpecialCondition.POISONED]));
    store.reduceEffect(store.state, new AddSpecialConditionsPowerEffect(player1, player1.active.getPokemonCard()!,
      player2.active, [SpecialCondition.POISONED]));
    expect(player1.active.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(player2.active.specialConditions).toEqual([]);
  });

  it('expires Ignition Energy on its owner’s turn even if the saved board had no marker', () => {
    const { player1, player2 } = open({ active: { card: lugiaStar, energy: [ignition] } },
      { active: { card: finneon, energy: [ignition] } });
    expect(player1.marker.markers).toEqual([]);
    store.dispatch(new PassTurnAction(player1.id));
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([ignition]);
    expect(player2.active.energies.cards.map(card => card.fullName)).toEqual([ignition]);
    store.dispatch(new PassTurnAction(player2.id));
    expect(player2.discard.cards.map(card => card.fullName)).toEqual([ignition]);
  });

  it('keeps Ignition Energy attached while Temple of Sinnoh suppresses it', () => {
    const { player1, player2 } = open({ active: { card: lugiaStar, energy: [ignition] }, hand: [temple] },
      { active: { card: finneon }, hand: ['Training Court RCL'] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new PassTurnAction(player1.id));
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([ignition]);
    store.dispatch(new PlayCardAction(player2.id, 0, board));
    store.dispatch(new PassTurnAction(player2.id));
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([ignition]);
    store.dispatch(new PassTurnAction(player1.id));
    expect(player1.discard.cards.map(card => card.fullName)).toContain(ignition);
  });

  it('also distinguishes a confirmed group of card-effect attachments from the hand', () => {
    const { player1 } = open({ active: { card: lugia }, hand: [fire, triple] });
    const attachments = (player1.hand.cards as EnergyCard[]).map(card => new AttachEnergyEffect(player1, card, player1.active));
    store.reduceEffect(store.state, new AttachEnergyFromHandEffect(player1, attachments, false));
    expect(player1.hand.cards).toEqual([]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([fire]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([triple]);
  });

  it('lets Impact Energy clear Poison before its own discard rule applies', () => {
    const impact = 'Impact Energy CRE';
    const { player1 } = open({ active: { card: lugia }, bench: [{ card: archeops }],
      deck: [impact, fire] });
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', bench));
    attach([impact, active]);
    shuffle([0]);
    expect(player1.active.specialConditions).toEqual([]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([impact]);
  });
});
