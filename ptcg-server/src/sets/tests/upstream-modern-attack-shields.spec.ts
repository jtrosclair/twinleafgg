import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { endTurn, useAttack } from './card-test-helpers';
import { padDeck, PokemonSlotConfig, setupGame } from './test-helpers';

const darkness = 'Darkness Energy SVE';
const fighting = 'Fighting Energy SVE';
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const psychic = 'Psychic Energy SVE';
const water = 'Water Energy SVE';

const moon = { card: 'Roaring Moon ex PAR', energy: [darkness, darkness, fighting] };
const koraidon = { card: 'Koraidon TEF', energy: [fire, fighting, water] };

function board(shield: PokemonSlotConfig, attacker = moon) {
  const game = setupGame({
    turn: 5,
    player1: { active: shield, bench: [{ card: 'Mew ex MEW' }], deck: padDeck(8) },
    player2: { active: attacker, bench: [{ card: 'Mew ex MEW' }], deck: padDeck(8) },
  });
  // Keep both original targets on the board across the exchange so we can check damage.
  game.player1.active.getPokemonCard()!.hp = 500;
  game.player2.active.getPokemonCard()!.hp = 500;
  return game;
}

beforeEach(() => {
  spyOn(Math, 'random').and.returnValue(0.1);
});

describe('modern full attack shields', () => {
  const shields = [
    { card: "Cynthia's Feebas DRI", energy: [water], attack: 'Undulate' },
    { card: 'Barboach OBF', energy: [fighting], attack: 'Hide' },
    { card: 'Hoppip PAL', energy: [grass], attack: 'Splashing Dodge' },
    { card: 'Charcadet PAR', energy: [fire], attack: 'Protect' },
    { card: 'Seaking MEW', energy: [water], attack: 'Swim Freely' },
    { card: 'Flittle SSP', energy: [psychic], attack: 'Splashing Dodge' },
    { card: 'Dunsparce TEF', energy: [water, water], attack: 'Dig' },
    { card: 'Marill MC', energy: [psychic], attack: 'Hide' },
    { card: 'Cherubi 30C', energy: [grass], attack: 'Hide' },
  ];

  for (const shield of shields) {
    it(`${shield.card} prevents Knock Out effects and their conditional recoil`, () => {
      const { store, state, player1, player2 } = board(shield);
      const protectedPokemon = player1.active.getPokemonCard();
      useAttack(store, state, 0, shield.attack);
      const damageBeforeGouging = player2.active.damage;
      useAttack(store, state, 1, 'Frenzied Gouging');
      expect(player1.active.getPokemonCard()?.id).toBe(protectedPokemon?.id);
      expect(player2.active.damage).toBe(damageBeforeGouging);
    });

    it(`${shield.card} lets Shred bypass its damage protection`, () => {
      const { store, state, player1 } = board(shield, koraidon);
      useAttack(store, state, 0, shield.attack);
      useAttack(store, state, 1, 'Shred');
      expect(player1.active.damage).toBe(130);
    });
  }

  it('Dunsparce Gnaw leaves protection off and never flips a coin', () => {
    const { store, state, player1 } = board(shields[6]);
    const reducer = spyOn(store, 'reduceEffect').and.callThrough();
    useAttack(store, state, 0, 'Gnaw');
    expect(reducer.calls.allArgs().some(([, effect]) => effect instanceof CoinFlipEffect)).toBe(false);
    useAttack(store, state, 1, 'Calamity Storm');
    expect(player1.active.damage).toBe(100);
  });

  it('Hide works on heads for one opposing turn', () => {
    const { store, state, player1 } = board(shields[7]);
    useAttack(store, state, 0, 'Hide');
    useAttack(store, state, 1, 'Calamity Storm');
    expect(player1.active.damage).toBe(0);
    endTurn(store, state);
    useAttack(store, state, 1, 'Calamity Storm');
    expect(player1.active.damage).toBe(100);
  });

  it('Hide leaves damage and effects enabled on tails', () => {
    const { store, state, player1, overridePrompt } = board(shields[7]);
    (Math.random as jasmine.Spy).and.returnValue(0.9);
    overridePrompt('Coin flip', () => false);
    useAttack(store, state, 0, 'Hide');
    useAttack(store, state, 1, 'Frenzied Gouging');
    expect(player1.discard.cards.some(card => card.name === 'Marill')).toBe(true);
    expect(state.players[1].active.damage).toBe(200);
  });

  it('a saved Cynthia’s Feebas marker still prevents the printed attack effects', () => {
    const { store, state, player1, player2 } = board(shields[0]);
    endTurn(store, state);
    const feebas = player1.active.getPokemonCard()!;
    player1.active.marker.addMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, feebas);
    player2.marker.addMarker(MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, feebas);
    useAttack(store, state, 1, 'Frenzied Gouging');
    expect(player1.active.getPokemonCard()).toBe(feebas);
    expect(player1.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, feebas))
      .toBe(false);
  });
});

describe('modern damage-only shields', () => {
  const shields = [
    { card: 'Shelmet JTG', energy: [grass, water], attack: 'Shell Hit' },
    { card: 'Altaria SSP', energy: [water, metal], attack: 'Cotton Wing' },
    { card: 'Noivern ex PAL', energy: [water, water], attack: 'Covert Flight' },
    { card: 'Nidoqueen MEW', energy: [darkness, water], attack: 'Queen Press' },
    { card: 'Dipplin SCR', energy: [grass], attack: 'Coated Attack' },
    { card: 'Golbat M4', energy: [darkness], attack: 'Covert Flight' },
    { card: 'Mega Manectric ex M1S', energy: [lightning, lightning], attack: 'Flash Ray' },
  ];

  for (const shield of shields) {
    it(`${shield.card} prevents ordinary damage from a Basic and lets Shred through`, () => {
      const normal = board(shield, koraidon);
      useAttack(normal.store, normal.state, 0, shield.attack);
      useAttack(normal.store, normal.state, 1, 'Primordial Beatdown');
      expect(normal.player1.active.damage).toBe(0);

      const shred = board(shield, koraidon);
      useAttack(shred.store, shred.state, 0, shield.attack);
      useAttack(shred.store, shred.state, 1, 'Shred');
      expect(shred.player1.active.damage).toBe(130);
    });

    it(`${shield.card} remains susceptible to a Basic Pokémon’s Knock Out effect`, () => {
      const { store, state, player1 } = board(shield);
      useAttack(store, state, 0, shield.attack);
      useAttack(store, state, 1, 'Frenzied Gouging');
      expect(player1.discard.cards.some(card => card.fullName === shield.card)).toBe(true);
    });
  }

  it('Covert Flight lets an Evolution Pokémon damage Noivern ex', () => {
    const { store, state, player1, overridePrompt } = board(shields[2], { card: 'Dragapult ex TWM', energy: [fire, psychic] });
    overridePrompt('Put damage', () => [
      { target: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }, damage: 60 },
    ]);
    useAttack(store, state, 0, 'Covert Flight');
    useAttack(store, state, 1, 'Phantom Dive');
    expect(player1.active.damage).toBe(200);
    expect(player1.bench[0].damage).toBe(60);
  });

  it('Flash Ray expires after the opponent’s turn and does not suppress Checkup damage', () => {
    const { store, state, player1 } = board(shields[6], koraidon);
    useAttack(store, state, 0, 'Flash Ray');
    player1.active.addSpecialCondition(SpecialCondition.POISONED);
    useAttack(store, state, 1, 'Primordial Beatdown');
    expect(player1.active.damage).toBe(10);
    endTurn(store, state);
    useAttack(store, state, 1, 'Primordial Beatdown');
    expect(player1.active.damage).toBe(60);
  });
});
