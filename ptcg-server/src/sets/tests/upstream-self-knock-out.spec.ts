import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { checkState } from '../../game/store/effect-reducers/check-effect';
import { GameWinner, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const board = { ...active, slot: SlotType.BOARD };
const bench = (index = 0): CardTarget => ({ ...active, slot: SlotType.BENCH, index });
const theirActive = { ...active, player: PlayerType.TOP_PLAYER };
const grass = 'Grass Energy SVE';
const lightning = 'Lightning Energy SVE';
const water = 'Water Energy SVE';
const fire = 'Fire Energy SVE';
const triple = 'Triple Acceleration Energy UNB';
const doubleTurbo = 'Double Turbo Energy BRS';
const lugia = 'Lugia V SIT';
const electrode = 'Electrode-GX CES';
const extraEnergyBomb = 'Extra Energy Bomb';
const magneton = 'Magneton SSP';
const forretress = 'Forretress ex PAL';
const blissey = 'Blissey V CRE';
const pikachu = 'Pikachu ex SSP';
const dusknoir = 'Dusknoir SFA';
const dusclops = 'Dusclops SFA';
const psyduck = 'Psyduck SVP';
const poltchageist = 'Poltchageist M5';

beforeAll(ensureClientCards);

describe('Printed self-Knock Out Abilities', () => {
  let store: Store;
  afterEach(() => store?.cleanup());

  function start(left: SetupGameConfig['player1'], right: SetupGameConfig['player2'] = { active: { card: blissey } }) {
    const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left },
      player2: { deck: padDeck(8), ...right } });
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
    if (!prompt) throw new Error('Expected a pending prompt');
    const decoded = prompt.decode(raw, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function observeKnockOuts() {
    const damage: number[] = [];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof KnockOutEffect) damage.push(effect.target.damage);
      return reduce(state, effect);
    });
    return damage;
  }

  for (const available of [2, 5, 6]) {
    it(`Extra Energy Bomb requires the correct count from ${available} available Energy cards`, () => {
      const { player1, player2 } = start({ active: { card: pikachu }, bench: [{ card: electrode, damage: 20, energy: [fire] }, { card: lugia }],
        discard: [...Array(available).fill(lightning), 'Potion BS'] });
      const damageAtKnockOut = observeKnockOuts();
      const [ownEnergy] = player1.bench[0].energies.cards;
      store.dispatch(new UseAbilityAction(player1.id, extraEnergyBomb, bench()));
      const prompt = pending() as AttachEnergyPrompt;
      expect(prompt instanceof AttachEnergyPrompt).toBe(true);
      const count = Math.min(available, 5);
      expect(prompt.options.min).toBe(count);
      expect(prompt.options.max).toBe(count);
      expect(prompt.cardList.cards).not.toContain(ownEnergy);
      expect(prompt.validate([])).toBe(false);
      expect(prompt.validate(prompt.decode(Array.from({ length: count - 1 }, (_, index) => ({ index, to: active })), store.state))).toBe(false);
      resolve(Array.from({ length: count }, (_, index) => ({ index, to: index === 0 ? active : bench(1) })));
      expect(player1.active.energies.cards.length).toBe(1);
      expect(player1.bench[1].energies.cards.length).toBe(count - 1);
      expect(player1.discard.cards).toContain(ownEnergy);
      expect(player1.discard.cards.some(card => card.fullName === electrode)).toBe(true);
      expect(player2.getPrizeLeft()).toBe(4);
      expect(damageAtKnockOut).toEqual([20]);
      expect(pending()).toBeUndefined();
    });
  }

  it('blocks Classic Pokémon-EX and Pokémon-GX recipients but permits a modern Pokémon ex', () => {
    const { player1 } = start({ active: { card: electrode }, bench: [
      { card: 'Tapu Lele-GX GRI' }, { card: 'Mewtwo-EX BKT' }, { card: pikachu },
    ], discard: [lightning] });
    store.dispatch(new UseAbilityAction(player1.id, extraEnergyBomb, active));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.options.blockedTo).toEqual([active, bench(0), bench(1)]);
    expect(prompt.validate(prompt.decode([{ index: 0, to: bench(1) }], store.state))).toBe(false);
    expect(prompt.validate(prompt.decode([{ index: 0, to: bench(2) }], store.state))).toBe(true);
  });

  it('rejects Extra Energy Bomb if there is no eligible recipient', () => {
    const { player1 } = start({ active: { card: electrode }, bench: [{ card: 'Tapu Lele-GX GRI' }], discard: [lightning] });
    expect(() => store.dispatch(new UseAbilityAction(player1.id, extraEnergyBomb, active))).toThrow();
    expect(store.state.players[0].active.getPokemonCard()?.fullName).toBe(electrode);
    expect(pending()).toBeUndefined();
  });

  it('does not offer Electrode-GX’s own attached Energy as a starting discard source', () => {
    const { player1 } = start({ active: { card: electrode, energy: [lightning] }, bench: [{ card: pikachu }] });
    expect(() => store.dispatch(new UseAbilityAction(player1.id, extraEnergyBomb, active))).toThrow();
    expect(store.state.players[0].active.energies.cards[0].fullName).toBe(lightning);
    expect(pending()).toBeUndefined();
  });

  it('can use Triple Acceleration Energy from the discard and still Knocks Out Electrode-GX after its discard', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: electrode }],
      hand: ['Festival Grounds TWM'], discard: [triple] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    store.dispatch(new UseAbilityAction(player1.id, extraEnergyBomb, bench()));
    resolve([{ index: 0, to: active }]);
    expect(player1.active.specialConditions).toEqual([]);
    expect(player1.active.energies.cards).toEqual([]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(triple);
    expect(player2.getPrizeLeft()).toBe(4);
    expect(pending()).toBeUndefined();
  });

  for (const selected of [0, 2]) {
    it(`Crush and Burn-GX deals the printed damage with ${selected} discarded cards and spends the GX attack`, () => {
      const { player1, player2 } = start({ active: { card: electrode, energy: [lightning, water] }, bench: [{ card: lugia, energy: [fire] }] });
      store.dispatch(new AttackAction(player1.id, 'Crash and Burn-GX'));
      expect(pending() instanceof DiscardEnergyPrompt).toBe(true);
      resolve(selected ? [{ from: active, index: 1 }, { from: bench(), index: 1 }] : []);
      if (pending() instanceof WaitPrompt) resolve(true);
      expect(player1.usedGX).toBe(true);
      expect(player2.active.damage).toBe(30 + 50 * selected);
      expect(player1.discard.cards.length).toBe(selected);
    });
  }

  it('uses effective Lightning typing and can attach to the Magneton using Overvolt Discharge', () => {
    const { player1, player2 } = start({ active: { card: 'Kecleon CRE', energy: [lightning] }, bench: [{ card: magneton }, { card: lugia }],
      discard: [water, fire, lightning, doubleTurbo] });
    store.dispatch(new UseAbilityAction(player1.id, 'Overvolt Discharge', bench()));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.options.blockedTo).toEqual([bench(1)]);
    expect(prompt.options.max).toBe(3);
    expect(prompt.validate(prompt.decode([{ index: 3, to: active }], store.state))).toBe(false);
    resolve([{ index: 0, to: active }, { index: 1, to: bench() }]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([lightning, water]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(fire);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(magneton);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(pending()).toBeUndefined();
  });

  it('lets the user decline Overvolt Discharge before committing', () => {
    const { player1, player2 } = start({ active: { card: magneton }, bench: [{ card: pikachu }], discard: [fire] });
    store.dispatch(new UseAbilityAction(player1.id, 'Overvolt Discharge', active));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.validate([])).toBe(false);
    resolve(null);
    expect(player1.active.getPokemonCard()?.fullName).toBe(magneton);
    expect(player1.discard.cards[0].fullName).toBe(fire);
    expect(player2.getPrizeLeft()).toBe(6);
  });

  it('rejects Overvolt Discharge if the discard only contains Special Energy', () => {
    const { player1 } = start({ active: { card: magneton }, discard: [doubleTurbo] });
    expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Overvolt Discharge', active))).toThrow();
    expect(pending()).toBeUndefined();
  });

  for (const selected of [0, 2, 5]) {
    it(`Exploding Energy shuffles once and awards two Prizes after attaching ${selected} Energy`, () => {
      const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: forretress }],
        deck: [...Array(5).fill(grass), 'Potion BS', lightning] });
      store.dispatch(new UseAbilityAction(player1.id, 'Exploding Energy', bench()));
      const prompt = pending() as AttachEnergyPrompt;
      expect(prompt instanceof AttachEnergyPrompt).toBe(true);
      expect(prompt.isEligibleCard(player1.deck.cards[6], 6)).toBe(false);
      resolve(Array.from({ length: selected }, (_, index) => ({ index, to: active })));
      expect(player1.active.energies.cards.length).toBe(selected);
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(forretress);
      expect(player2.getPrizeLeft()).toBe(6);
      expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
      const order = player1.deck.cards.map((_, index, cards) => cards.length - index - 1);
      resolve(order);
      expect(player1.deck.cards[0].fullName).toBe(lightning);
      expect(player1.discard.cards.map(card => card.fullName)).toContain(forretress);
      expect(player2.getPrizeLeft()).toBe(4);
      expect(pending()).toBeUndefined();
    });
  }

  it('allows Exploding Energy to attach to its source before the source is Knocked Out', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: forretress }], deck: [grass, lightning] });
    const [attached] = player1.deck.cards;
    store.dispatch(new UseAbilityAction(player1.id, 'Exploding Energy', bench()));
    resolve([{ index: 0, to: bench() }]);
    expect(player1.bench[0].energies.cards).toContain(attached);
    resolve([0]);
    expect(player1.discard.cards).toContain(attached);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(forretress);
    expect(player2.getPrizeLeft()).toBe(4);
  });

  it('prevents Exploding Energy with an empty deck', () => {
    const { player1 } = start({ active: { card: forretress }, deck: [] });
    expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Exploding Energy', active))).toThrow();
    expect(pending()).toBeUndefined();
  });

  it('Knocks Out Call Signal Magneton after its zero-result search and shuffle', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: 'Magneton CEC' }], deck: [lightning, water] });
    store.dispatch(new UseAbilityAction(player1.id, 'Call Signal', bench()));
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([]);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    expect(player2.getPrizeLeft()).toBe(6);
    resolve([1, 0]);
    expect(player1.deck.cards.map(card => card.fullName)).toEqual([water, lightning]);
    expect(player1.discard.cards[0].fullName).toBe('Magneton CEC');
    expect(player2.getPrizeLeft()).toBe(5);
  });

  for (const source of [dusclops, dusknoir]) {
    it(`${source} Knocks itself Out after Cursed Blast is blocked by Ghost Veil`, () => {
      const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: source, damage: 20 }] },
        { active: { card: poltchageist } });
      const damageAtKnockOut = observeKnockOuts();
      store.dispatch(new UseAbilityAction(player1.id, 'Cursed Blast', bench()));
      resolve([theirActive]);
      expect(player2.active.damage).toBe(0);
      expect(player1.discard.cards[0].fullName).toBe(source);
      expect(player2.getPrizeLeft()).toBe(5);
      expect(damageAtKnockOut).toEqual([20]);
    });
  }

  it('resolves simultaneous Cursed Blast Knock Outs and offers the opponent the first promotion', () => {
    const { player1, player2 } = start({ active: { card: dusknoir }, bench: [{ card: lugia }] },
      { active: { card: 'Charmander BS' }, bench: [{ card: pikachu }] });
    store.dispatch(new UseAbilityAction(player1.id, 'Cursed Blast', active));
    resolve([theirActive]);
    expect(player1.getPrizeLeft()).toBe(5);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    expect(pending()?.playerId).toBe(player2.id);
    resolve([bench()]);
    expect(pending()?.playerId).toBe(player1.id);
    resolve([bench()]);
    expect(player1.active.getPokemonCard()?.fullName).toBe(lugia);
    expect(player2.active.getPokemonCard()?.fullName).toBe(pikachu);
  });

  it('counts both final Prizes before deciding the winner of a double Cursed Blast Knock Out', () => {
    const { player1, player2 } = start({ active: { card: dusknoir }, bench: [{ card: lugia }], prizeCount: 1 },
      { active: { card: 'Charmander BS' }, prizeCount: 1 });
    store.dispatch(new UseAbilityAction(player1.id, 'Cursed Blast', active));
    resolve([theirActive]);
    expect(player1.getPrizeLeft()).toBe(0);
    expect(player2.getPrizeLeft()).toBe(0);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  it('draws available cards before awarding the Prize from Mysterious Message', () => {
    const { player1, player2 } = start({ active: { card: 'Mismagius UNB' }, bench: [{ card: lugia }], deck: [fire, water] });
    const damageAtKnockOut = observeKnockOuts();
    store.dispatch(new UseAbilityAction(player1.id, 'Mysterious Message', active));
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([fire, water]);
    expect(player1.discard.cards[0].fullName).toBe('Mismagius UNB');
    expect(player2.getPrizeLeft()).toBe(5);
    expect(damageAtKnockOut).toEqual([0]);
  });

  for (const [card, power, discard] of [
    [dusclops, 'Cursed Blast', []], [magneton, 'Overvolt Discharge', [lightning]],
    [electrode, extraEnergyBomb, [lightning]], ['Mismagius UNB', 'Mysterious Message', []],
  ] as const) {
    it(`Damp prevents ${power} without any prompt, damage, or Knock Out`, () => {
      const { player1 } = start({ active: { card: lugia }, bench: [{ card }], discard: [...discard] },
        { active: { card: blissey }, bench: [{ card: psyduck }] });
      expect(() => store.dispatch(new UseAbilityAction(player1.id, power, bench()))).toThrow();
      expect(store.state.players[0].bench[0].getPokemonCard()?.fullName).toBe(card);
      expect(store.state.players[1].getPrizeLeft()).toBe(6);
      expect(pending()).toBeUndefined();
    });
  }

  it('resolves a self-Knock Out from an underlying card on its current physical stack only', () => {
    const { player1, player2 } = start({ active: { card: lugia }, bench: [{ card: dusclops }, { card: dusclops }] });
    const first = player1.bench[0];
    const second = player1.bench[1];
    const underneath = first.getPokemonCard()!;
    const top = second.getPokemonCard()!;
    second.moveCardTo(top, first);
    expect(first.getPokemonCard()).toBe(top);
    const damageAtKnockOut = observeKnockOuts();
    store.reduceEffect(store.state, new SelfKnockOutEffect(player1, underneath));
    expect(first.damage).toBe(0);
    checkState(store, store.state);
    expect(player1.discard.cards).toContain(underneath);
    expect(player1.discard.cards).toContain(top);
    expect(player2.getPrizeLeft()).toBe(5);
    expect(damageAtKnockOut).toEqual([0]);
    checkState(store, store.state);
    expect(player2.getPrizeLeft()).toBe(5);
  });
});
