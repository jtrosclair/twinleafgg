import { GameLog } from '../../game/game-message';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType } from '../../game/store/card/card-types';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const basicDarkness = 'Darkness Energy SVE';
const water = 'Water Energy SVE';
const fighting = 'Fighting Energy SVE';
const neo = 'Darkness Energy N1';
const secretWonders = 'Darkness Energy SW';
const exPrints = ['Darkness Energy RS', ...['DS', 'EM', 'HP', 'PK', 'UF'].map(set => `Darkness Energy Special ${set}`)];
const laterPrints = ['Darkness Energy MT', secretWonders, 'Darkness Energy MD', 'Darkness Energy RR', 'Darkness Energy UD'];
const rookidee = { card: 'Rookidee SSH' };
const arceus = { card: 'Arceus V BRS' };
const weavile = { card: 'Weavile SW' };
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { ...ownActive, slot: SlotType.BENCH };
const board = { ...ownActive, slot: SlotType.BOARD };

function battle(left: PlayerConfig, right: PlayerConfig) {
  return setupGame({
    turn: 5,
    player1: { bench: [weavile], deck: padDeck(16), ...left },
    player2: { bench: [arceus], deck: padDeck(16), ...right }
  });
}

function typeOf(game: ReturnType<typeof battle>, slot: PokemonCardList) {
  const query = new CheckPokemonTypeEffect(slot);
  game.store.reduceEffect(game.state, query);
  return query.cardTypes;
}

function hitDamage(game: ReturnType<typeof battle>, attack: string) {
  return game.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_DEALS_DAMAGE && log.params?.effect === attack)
    .map(log => log.params?.damage);
}

describe('Dark Engage and Conversion', () => {
  it('starts Weavile SW as Water with Metal Weakness and no Resistance', () => {
    const game = battle({ active: weavile, bench: [] }, { active: rookidee });
    const pokemon = game.player1.active.getPokemonCard()!;
    expect(typeOf(game, game.player1.active)).toEqual([CardType.WATER]);
    expect(pokemon.weakness).toEqual([{ type: CardType.METAL, value: 20 }]);
    expect(pokemon.resistance).toEqual([]);
  });

  it('keeps the affected Pokémon Dark through other type queries and expires at turn end', () => {
    const game = battle({ active: { card: 'Kingler GE' } }, { active: rookidee });
    const { store, player1, player2 } = game;
    store.dispatch(new UseAbilityAction(player1.id, 'Dark Engage', ownBench));
    expect(typeOf(game, player1.active)).toEqual([CardType.DARK]);
    expect(typeOf(game, player2.active)).toEqual([CardType.COLORLESS]);
    expect(typeOf(game, player1.bench[0])).toEqual([CardType.WATER]);
    expect(typeOf(game, player1.active)).toEqual([CardType.DARK]);
    store.dispatch(new PassTurnAction(player1.id));
    expect(typeOf(game, player1.active)).toEqual([CardType.WATER]);
  });

  it('clears Dark Engage when the Pokémon switches out and later returns', () => {
    const game = battle({
      active: { card: 'Kingler GE' }, hand: ['Switch SVI', 'Switch SVI']
    }, { active: rookidee });
    const { store, player1, overridePrompt } = game;
    store.dispatch(new UseAbilityAction(player1.id, 'Dark Engage', ownBench));
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(typeOf(game, player1.active)).toEqual([CardType.WATER]);
    expect(typeOf(game, player1.bench[0])).toEqual([CardType.WATER]);
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(typeOf(game, player1.active)).toEqual([CardType.WATER]);
  });

  for (const darkLast of [false, true]) {
    it(`uses the latest replacement when ${darkLast ? 'Dark Engage' : 'Conversion'} resolves last and retains Conversion on the Bench`, () => {
      const game = battle({
        active: { card: 'Porygon-Z GE' }, hand: [water, 'Switch SVI']
      }, { active: rookidee });
      const { store, player1, overridePrompt } = game;
      const darkEngage = new UseAbilityAction(player1.id, 'Dark Engage', ownBench);
      const conversion = new UseAbilityAction(player1.id, 'Conversion', ownActive);
      overridePrompt('Choose cards', () => [0]);
      store.dispatch(darkLast ? conversion : darkEngage);
      store.dispatch(darkLast ? darkEngage : conversion);
      expect(typeOf(game, player1.active)).toEqual([darkLast ? CardType.DARK : CardType.WATER]);
      overridePrompt('Choose pokemon', () => [ownBench]);
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      expect(typeOf(game, player1.bench[0])).toEqual([CardType.WATER]);
      store.dispatch(new PassTurnAction(player1.id));
      expect(typeOf(game, player1.bench[0])).toEqual([CardType.COLORLESS]);
    });
  }

  it('resolves and clears an older player-scoped Dark Engage marker', () => {
    const game = battle({ active: { card: 'Kingler GE' }, hand: ['Switch SVI'] }, { active: rookidee });
    const { store, player1, overridePrompt } = game;
    player1.marker.addMarker('DARK_ENGAGE_MARKER', player1.bench[0].getPokemonCard()!);
    expect(typeOf(game, player1.active)).toEqual([CardType.DARK]);
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(typeOf(game, player1.active)).toEqual([CardType.WATER]);
    expect(player1.marker.hasMarker('DARK_ENGAGE_MARKER')).toBe(false);
  });

  for (const selected of [false, true]) {
    it(`shuffles after Shadow Charge ${selected ? 'attaches Basic and Special Darkness Energy' : 'chooses zero cards'}`, () => {
      const game = battle({ active: weavile, deck: [basicDarkness, secretWonders, ...padDeck(16)] }, { active: arceus });
      const { store, player1, overridePrompt } = game;
      const energies = player1.deck.cards.slice(0, 2);
      player1.marker.addMarkerToState(player1.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK);
      const shuffled = jasmine.createSpy('shuffle').and.callFake(() => player1.deck.cards.map((_, index) => index));
      overridePrompt('Attach energy', () => selected ? [{ index: 0, to: ownActive }, { index: 1, to: ownBench }] : []);
      overridePrompt('Shuffle deck', shuffled);
      store.dispatch(new AttackAction(player1.id, 'Shadow Charge'));
      expect(shuffled).toHaveBeenCalledTimes(1);
      if (selected) {
        expect(player1.active.cards).toContain(energies[0]);
        expect(player1.bench[0].cards).toContain(energies[1]);
        expect(player1.bench[0].energies.cards).toContain(energies[1]);
        expect(energies.every(card => !player1.deck.cards.includes(card))).toBe(true);
      } else {
        expect(energies.every(card => player1.deck.cards.includes(card))).toBe(true);
      }
    });
  }
});

describe('Special Darkness Energy by printing', () => {
  for (const print of [...exPrints, ...laterPrints, neo]) {
    it(`applies ${print} at its printed damage step`, () => {
      const game = battle({ active: { card: 'Murkrow GRI', energy: [print] } }, { active: { card: 'Mew ex MEW' } });
      game.store.dispatch(new AttackAction(game.player1.id, 'Whirlwind'));
      expect(hitDamage(game, 'Whirlwind')).toEqual([print === neo ? 30 : 40]);
    });
  }

  for (const print of [neo, ...laterPrints]) {
    it(`handles the non-Dark holder's damage and end-of-turn counters with ${print}`, () => {
      const game = battle({ active: { card: 'Kingler GE', energy: [water, print] } }, { active: arceus });
      game.store.dispatch(new AttackAction(game.player1.id, 'Crabhammer'));
      expect(hitDamage(game, 'Crabhammer')).toEqual([print === neo ? 40 : 30]);
      expect(game.player1.active.damage).toBe(print === neo ? 10 : 0);
      game.store.dispatch(new PassTurnAction(game.player2.id));
      expect(game.player1.active.damage).toBe(print === neo ? 20 : 0);
    });
  }

  for (const [print, damage] of [[exPrints[0], 30], [secretWonders, 20], [neo, 30]] as const) {
    it(`resolves the Dark-name exception for ${print}`, () => {
      const game = battle({
        active: { card: 'Dark Dragonair TR', energy: [water, water, print] }
      }, { active: arceus });
      spyOn(Math, 'random').and.returnValue(0.9);
      game.store.dispatch(new AttackAction(game.player1.id, 'Tail Strike'));
      expect(hitDamage(game, 'Tail Strike')).toEqual([damage]);
      expect(game.player1.active.damage).toBe(0);
    });
  }

  it('adds both physical Special Darkness Energy cards to Kingler’s damage and recoil after Dark Engage', () => {
    const game = battle({
      active: { card: 'Kingler GE', energy: [water, water, secretWonders, secretWonders] }
    }, { active: rookidee });
    const { store, player1 } = game;
    store.dispatch(new UseAbilityAction(player1.id, 'Dark Engage', ownBench));
    store.dispatch(new AttackAction(player1.id, 'Scissor Blow'));
    expect(hitDamage(game, 'Scissor Blow')).toEqual([100, 50]);
    expect(player1.active.damage).toBe(50);
  });

  it('does not add post-Resistance damage to a hit reduced to zero', () => {
    const game = battle({ active: { card: 'Murkrow GRI', energy: [neo] } }, { active: arceus, bench: [] });
    game.player2.active.getPokemonCard()!.resistance = [{ type: CardType.DARK, value: -20 }];
    game.store.dispatch(new AttackAction(game.player1.id, 'Whirlwind'));
    expect(game.player2.active.damage).toBe(0);
  });
});

describe('Energy attachment from deck and discard', () => {
  it('moves the physical cards selected with Mirage Gate out of the deck', () => {
    const game = battle({
      active: { card: 'Cramorant LOR' }, hand: ['Mirage Gate LOR'], deck: [water, fighting, ...padDeck(16)]
    }, { active: arceus });
    const { store, player1, overridePrompt } = game;
    const selected = player1.deck.cards.slice(0, 2);
    player1.lostzone.cards.push(...Array.from({ length: 7 }, (_, index) => {
      const card = getCardByName(water);
      card.id = 20000 + index;
      return card;
    }));
    overridePrompt('Attach energy', () => [{ index: 0, to: ownActive }, { index: 1, to: ownBench }]);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(player1.active.cards).toContain(selected[0]);
    expect(player1.bench[0].cards).toContain(selected[1]);
    expect(selected.every(card => !player1.deck.cards.includes(card))).toBe(true);
  });

  it('moves Special Energy out of the discard pile under a hand-only attachment lock', () => {
    const game = battle({ active: { card: 'Garchomp BKP', energy: [fighting] }, discard: [secretWonders] },
      { active: arceus });
    const { store, player1, overridePrompt } = game;
    const energy = player1.discard.cards[0];
    player1.marker.addMarkerToState(player1.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK);
    overridePrompt('Attach energy', () => [{ index: 0, to: ownBench }]);
    store.dispatch(new AttackAction(player1.id, 'Turbo Assault'));
    expect(player1.discard.cards).not.toContain(energy);
    expect(player1.bench[0].cards).toContain(energy);
    expect(player1.bench[0].energies.cards).toContain(energy);
  });
});
