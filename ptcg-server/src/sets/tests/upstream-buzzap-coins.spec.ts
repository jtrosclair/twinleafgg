import { ensureClientCards } from '../../client/cards';
import { compactSerializedState } from '../../game/serializer/compact-state';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Card } from '../../game/store/card/card';
import { CardType, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, CoinFlipEffect, CoinFlipSequenceEffect } from '../../game/store/effects/play-card-effects';
import { COIN_FLIPS_TREATED_AS_TAILS } from '../../game/store/prefabs/coin-flip-results';
import { SIMULATE_COIN_FLIP } from '../../game/store/prefabs/prefabs';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const active: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = (index = 0): CardTarget => ({ ...active, slot: SlotType.BENCH, index });
const theirActive = { ...active, player: PlayerType.TOP_PLAYER };
const electrode = 'Electrode BS';
const thunder = 'Electrode EVO';
const cofagrigus = 'Cofagrigus PLF';
const pikachu = 'Pikachu ex SSP';
const lugia = 'Lugia V SIT';
const blissey = 'Blissey V CRE';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const fire = 'Fire Energy SVE';

beforeAll(ensureClientCards);

describe('Buzzap and next-turn coin effects', () => {
  let store: Store;
  afterEach(() => store?.cleanup());

  function start(left: PlayerConfig, right: PlayerConfig = { active: { card: blissey } }) {
    const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left },
      player2: { deck: padDeck(8), ...right } });
    game.store.cleanup();
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    return game;
  }

  function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('No pending prompt');
    const decoded = prompt.decode(raw, store.state);
    if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid ${prompt.type} result`);
    store.dispatch(new ResolvePromptAction(prompt.id, decoded));
  }

  function animations() {
    while (pending() instanceof WaitPrompt) resolve(true);
  }

  function roundTrip() {
    const state = store.state;
    const physical: Card[] = [];
    for (const player of state.players) {
      for (const zone of [player.active, ...player.bench, player.deck, player.hand, player.discard,
        player.lostzone, player.stadium, player.supporter, ...player.prizes]) {
        zone.cards.forEach(card => { if (!physical.includes(card)) physical.push(card); });
      }
      for (const slot of [player.active, ...player.bench]) {
        slot.tools.forEach(card => { if (!physical.includes(card)) physical.push(card); });
      }
    }
    physical.forEach((card, id) => { card.id = id; });
    state.cardNames = physical.map(card => card.fullName);
    const serializer = new StateSerializer();
    const snapshot = serializer.serialize(state);
    const restored = serializer.deserialize(compactSerializedState(snapshot));
    expect(serializer.serialize(restored)).toEqual(snapshot);
    store.restoreState(restored);
    return restored;
  }

  for (const print of [electrode, thunder]) {
    it(`${print} preserves its physical identity and settles the Prize and promotion after attaching`, () => {
      const { player1, player2 } = start({ active: { card: print, energy: [fire], tools: ['Exp. Share SVI'], damage: 20 },
        bench: [{ card: pikachu }, { card: lugia, energy: [lightning] }], deck: ['Voltorb BS', ...padDeck(8)] });
      const card = player1.active.getPokemonCard()!;
      const [underneath] = player1.deck.cards;
      player1.deck.cards.shift();
      player1.active.cards.unshift(underneath);
      const events: { damage: number; prizes: number }[] = [];
      const reduce = store.reduceEffect.bind(store);
      spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof KnockOutEffect) events.push({ damage: effect.target.damage, prizes: player2.getPrizeLeft() });
        return reduce(state, effect);
      });
      store.dispatch(new UseAbilityAction(player1.id, card.powers[0].name, active));
      if (print === electrode) {
        expect(pending() instanceof SelectPrompt).toBe(true);
        resolve(5);
      }
      expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
      expect(player1.active.getPokemonCard()).toBe(card);
      expect(player2.getPrizeLeft()).toBe(6);
      expect(() => resolve([active])).toThrow();
      if (print === thunder) expect(() => resolve([bench(1)])).toThrow();
      resolve([bench()]);
      expect(events).toEqual([{ damage: 20, prizes: 6 }]);
      expect(player1.discard.cards).toContain(underneath);
      expect(player1.discard.cards.map(c => c.fullName)).toContain(fire);
      expect(player1.discard.cards.map(c => c.fullName)).toContain('Exp. Share SVI');
      expect(player1.discard.cards).not.toContain(card);
      expect(player1.bench[0].cards).toContain(card);
      expect(player1.bench[0].energies.cards).toEqual([card]);
      expect(card.superType).toBe(SuperType.ENERGY);
      expect(player2.getPrizeLeft()).toBe(5);
      expect(pending()?.playerId).toBe(player1.id);
      resolve([bench()]);
      expect(player1.active.getPokemonCard()?.fullName).toBe(pikachu);
      const check = new CheckProvidedEnergyEffect(player1, player1.active);
      store.reduceEffect(store.state, check);
      const type = print === electrode ? CardType.FIRE : CardType.LIGHTNING;
      expect(check.energyMap.filter(entry => entry.card === card).map(entry => entry.provides)).toEqual([[type, type]]);

      const restored = roundTrip(), restoredSlot = restored.players[0].active;
      const restoredCard = restoredSlot.energies.cards[0];
      expect(restoredSlot.cards.find(c => c.id === card.id)).toBe(restoredCard);
      expect(restoredCard.superType).toBe(SuperType.ENERGY);
      const recheck = new CheckProvidedEnergyEffect(restored.players[0], restoredSlot);
      store.reduceEffect(restored, recheck);
      expect(recheck.energyMap.filter(entry => entry.card === restoredCard).map(entry => entry.provides)).toEqual([[type, type]]);
    });
  }

  it('keeps two Buzzap choices independent when cards move to another holder and through restore', () => {
    const { player1 } = start({ active: { card: pikachu }, bench: [{ card: electrode }, { card: electrode }, { card: lugia }] });
    for (const [index, choice] of [5, 7].entries()) {
      store.dispatch(new UseAbilityAction(player1.id, 'Buzzap', bench(index)));
      resolve(choice);
      resolve([active]);
    }
    const [first, second] = player1.active.energies.cards;
    player1.active.moveCardTo(first, player1.bench[2]);
    const state = roundTrip();
    const p1 = state.players[0];
    const a = new CheckProvidedEnergyEffect(p1, p1.active);
    const b = new CheckProvidedEnergyEffect(p1, p1.bench[2]);
    store.reduceEffect(state, a);
    store.reduceEffect(state, b);
    expect(a.energyMap).toEqual([{ card: p1.active.energies.cards[0], provides: [CardType.LIGHTNING, CardType.LIGHTNING] }]);
    expect(b.energyMap).toEqual([{ card: p1.bench[2].energies.cards[0], provides: [CardType.FIRE, CardType.FIRE] }]);
    expect(p1.active.energies.cards[0].id).toBe(second.id);
    expect(getCardByName(electrode).superType).toBe(SuperType.POKEMON);
  });

  it('allows Enhanced Hammer to discard Buzzap Thunder and restores Pokémon form immediately', () => {
    const { player1, player2 } = start({ active: { card: pikachu }, bench: [{ card: thunder }] },
      { active: { card: blissey }, hand: ['Enhanced Hammer TWM'] });
    const card = player1.bench[0].getPokemonCard()!;
    const origins: (string | undefined)[] = [];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AttachEnergyEffect) origins.push(effect.sourceZone);
      return reduce(state, effect);
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Buzzap Thunder', bench()));
    resolve([active]);
    expect(origins).toEqual(['in-play']);
    expect(player1.energyPlayedTurn).toBe(0);
    store.dispatch(new PassTurnAction(player1.id));
    store.dispatch(new PlayCardAction(player2.id, player2.hand.cards.findIndex(c => c.name === 'Enhanced Hammer'),
      { ...active, slot: SlotType.BOARD }));
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([theirActive]);
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([0]);
    expect(player1.discard.cards.filter(c => c === card)).toEqual([card]);
    expect(player1.active.energies.cards).not.toContain(card);
    expect(card.superType).toBe(SuperType.POKEMON);
  });

  it('Buzzap Thunder keeps providing Lightning after being moved to another type and becomes Colorless under Temple', () => {
    const { player1 } = start({ active: { card: pikachu }, bench: [{ card: thunder }, { card: lugia }] });
    store.dispatch(new UseAbilityAction(player1.id, 'Buzzap Thunder', bench()));
    resolve([active]);
    const card = player1.active.energies.cards[0];
    player1.active.moveCardTo(card, player1.bench[1]);
    for (const hasTemple of [false, true]) {
      if (hasTemple) player1.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
      const check = new CheckProvidedEnergyEffect(player1, player1.bench[1]);
      store.reduceEffect(store.state, check);
      expect(check.energyMap).toEqual(hasTemple
        ? [{ card, provides: [CardType.COLORLESS], disableBlend: true }]
        : [{ card, provides: [CardType.LIGHTNING, CardType.LIGHTNING] }]);
    }
  });

  for (const [print, power] of [[electrode, 'Buzzap'], [thunder, 'Buzzap Thunder']]) {
    it(`${power} rejects a board with no eligible recipient`, () => {
      const { player1, player2 } = start({ active: { card: print },
        bench: print === thunder ? [{ card: lugia }] : [] });
      expect(() => store.dispatch(new UseAbilityAction(player1.id, power, active))).toThrow();
      expect(player2.getPrizeLeft()).toBe(6);
      expect(pending()).toBeUndefined();
    });
  }

  it('Damp blocks Buzzap Thunder and Poison prevents Base Set Buzzap', () => {
    const old = start({ active: { card: electrode }, bench: [{ card: pikachu }] });
    old.player1.active.specialConditions.push(SpecialCondition.POISONED);
    expect(() => store.dispatch(new UseAbilityAction(old.player1.id, 'Buzzap', active))).toThrow();
    store.cleanup();
    const newer = start({ active: { card: thunder }, bench: [{ card: pikachu }] },
      { active: { card: 'Psyduck SVP' } });
    expect(() => store.dispatch(new UseAbilityAction(newer.player1.id, 'Buzzap Thunder', active))).toThrow();
    expect(pending()).toBeUndefined();
  });

  it('discards a former Buzzap attachment once when its holder leaves play', () => {
    const { player1, player2 } = start({ active: { card: 'Charmander BS', damage: 40 }, bench: [{ card: electrode }, { card: lugia }] },
      { active: { card: 'Squirtle BS', energy: ['Water Energy SVE'] } });
    store.dispatch(new UseAbilityAction(player1.id, 'Buzzap', bench()));
    resolve(5);
    resolve([active]);
    const [card] = player1.active.energies.cards;
    store.dispatch(new PassTurnAction(player1.id));
    store.dispatch(new AttackAction(player2.id, 'Bubble'));
    animations();
    if (pending() instanceof CoinFlipPrompt) resolve(false);
    animations();
    if (pending() instanceof ChoosePokemonPrompt) resolve([bench(1)]);
    expect(player1.discard.cards.filter(c => c === card)).toEqual([card]);
    expect(card.superType).toBe(SuperType.POKEMON);
  });

  for (const [source, attack, energy] of [
    [cofagrigus, 'Slap of Misfortune', [psychic, psychic, psychic]],
    ['Unown [E] MT', 'Hidden Power', [psychic, psychic]],
    ['Drowzee FFI', 'Sinister Suggestion', [psychic]],
  ] as const) {
    it(`${attack} forces only the opponent's next-turn coin results`, () => {
      spyOn(Math, 'random').and.returnValue(0.01);
      const { player1, player2 } = start({ active: { card: source, energy: [...energy] } },
        { active: { card: blissey, energy: ['Mist Energy TEF'] } });
      store.dispatch(new AttackAction(player1.id, attack));
      animations();
      expect(pending()).toBeUndefined();
      expect(player2.marker.hasMarker(COIN_FLIPS_TREATED_AS_TAILS)).toBe(true);
      expect(store.state.players[store.state.activePlayer]).toBe(player2);

      const own = new CoinFlipEffect(player1);
      store.reduceEffect(store.state, own);
      expect(own.result).toBe(true);
      animations();
      const opposite = new CoinFlipEffect(player2);
      opposite.forcedResult = true;
      store.reduceEffect(store.state, opposite);
      expect(opposite.result).toBe(false);
      animations();
      expect(SIMULATE_COIN_FLIP(store, store.state, player2)).toBe(false);
      store.dispatch(new PassTurnAction(player2.id));
      store.dispatch(new PassTurnAction(player1.id));
      const later = new CoinFlipEffect(player2);
      store.reduceEffect(store.state, later);
      expect(later.result).toBe(true);
    });
  }

  it('Slap of Misfortune turns a submitted Confusion heads into tails after snapshot restoration', () => {
    const { player1, player2 } = start({ active: { card: cofagrigus, energy: [psychic, psychic, psychic] } },
      { active: { card: blissey, energy: [fire], damage: 0 } });
    store.dispatch(new AttackAction(player1.id, 'Slap of Misfortune'));
    animations();
    const restored = roundTrip();
    const opponent = restored.players[1];
    expect(opponent.id).toBe(player2.id);
    opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
    store.dispatch(new AttackAction(opponent.id, 'Blissful Blast'));
    const prompt = pending();
    expect(prompt instanceof CoinFlipPrompt).toBe(true);
    resolve(true);
    expect(prompt?.result).toBe(false);
    expect(opponent.active.damage).toBe(100);
    expect(opponent.marker.hasMarker(COIN_FLIPS_TREATED_AS_TAILS)).toBe(false);
  });

  it('applies Slap of Misfortune on a copied attack through a turn break', () => {
    const { player1, player2 } = start({ active: { card: 'Mew ex MEW', energy: [psychic, psychic, psychic] } },
      { active: { card: cofagrigus }, bench: [{ card: blissey }] });
    store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
    animations();
    expect(pending() instanceof ChooseAttackPrompt).toBe(true);
    resolve({ index: 0, attack: 'Slap of Misfortune' });
    animations();
    expect(player2.marker.hasMarker(COIN_FLIPS_TREATED_AS_TAILS)).toBe(true);
    expect(store.state.players[store.state.activePlayer]).toBe(player2);
  });

  it('keeps the next-turn coin effect after Rocky Helmet Knocks Out Cofagrigus', () => {
    spyOn(Math, 'random').and.returnValue(0.01);
    const { player1, player2 } = start({ active: { card: cofagrigus, energy: [psychic, psychic, psychic], damage: 80 },
      bench: [{ card: lugia }] }, { active: { card: blissey, tools: ['Rocky Helmet SVI'] } });
    const source = player1.active.getPokemonCard()!;
    store.dispatch(new AttackAction(player1.id, 'Slap of Misfortune'));
    animations();
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([bench()]);
    expect(player1.discard.cards).toContain(source);
    expect(player2.marker.hasMarker(COIN_FLIPS_TREATED_AS_TAILS, source)).toBe(true);
    const coin = new CoinFlipEffect(player2);
    store.reduceEffect(store.state, coin);
    expect(coin.result).toBe(false);
  });

  for (const count of [1, 2]) {
    it(`forces Glimwood Tangle's initial ${count} flip(s) and any reflip to tails`, () => {
      spyOn(Math, 'random').and.returnValue(0.01);
      const { player1, player2 } = start({ active: { card: cofagrigus, energy: [psychic, psychic, psychic] } });
      player1.stadium.cards.push(getCardByName('Glimwood Tangle DAA'));
      store.dispatch(new AttackAction(player1.id, 'Slap of Misfortune'));
      animations();
      store.state.phase = GamePhase.ATTACK;
      let flips: boolean[] | undefined;
      if (count === 1) {
        const single = new CoinFlipEffect(player2, result => { flips = [result]; });
        store.reduceEffect(store.state, single);
        expect(single.result).toBe(false);
      } else {
        store.reduceEffect(store.state, new CoinFlipSequenceEffect(player2, count, outcomes => { flips = outcomes; }));
      }
      animations();
      expect(pending() instanceof ConfirmPrompt).toBe(true);
      resolve(true);
      animations();
      expect(flips).toEqual(Array(count).fill(false));
    });
  }
});
