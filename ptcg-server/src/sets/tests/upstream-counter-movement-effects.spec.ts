import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { RemoveDamagePrompt } from '../../game/store/prompts/remove-damage-prompt';
import { useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const dark = 'Darkness Energy SVE';
const fire = 'Fire Energy SVE';
const psychic = 'Psychic Energy SVE';
const munki = 'Munkidori TWM';
const clefable = 'Mega Clefable ex M3';
const watchtower = "Team Rocket's Watchtower DRI";
const cage = 'Battle Colosseum M2';
const rocket = "Team Rocket's Wobbuffet DRI";
const topActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const topBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

function adrena(defender = mew, secondBench = mew, energy = dark, hand: string[] = []) {
  return setupGame({
    turn: 5,
    player1: { active: { card: mew, damage: 50 }, bench: [{ card: munki, energy: [energy], damage: 20 }],
      hand, deck: padDeck(10) },
    player2: { active: { card: defender }, bench: [{ card: secondBench }], deck: padDeck(10) }
  });
}

describe('Watchful Eye blocks movement based on the live Patrat', () => {
  for (const patrat of ['Patrat M4', 'Patrat M4 70']) {
    it(patrat + ' prevents Adrena-Brain from moving counters', () => {
      const game = adrena(mew, patrat);
      expect(() => useAbility(game.store, game.state, 0, 'Adrena-Brain'))
        .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
      expect(game.player1.active.damage).toBe(50);
      expect(game.player2.active.damage).toBe(0);
    });

    it(patrat + ' allows the move under Team Rocket’s Watchtower', () => {
      const game = adrena(mew, patrat);
      game.player2.stadium.cards.push(getCardByName(watchtower));
      game.overridePrompt('Remove damage', () => Array(3).fill({ from: ownActive, to: topActive }));
      useAbility(game.store, game.state, 0, 'Adrena-Brain');
      expect(game.player1.active.damage).toBe(20);
      expect(game.player2.active.damage).toBe(30);
    });

    it(patrat + ' keeps Rocket Mirror’s counters on the Bench', () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: rocket, energy: [psychic, fire] },
          bench: [{ card: rocket, damage: 50 }], deck: padDeck(10) },
        player2: { active: { card: mew }, bench: [{ card: patrat }], deck: padDeck(10) }
      });
      useAttack(game.store, game.state, 0, 'Rocket Mirror');
      expect(game.player1.bench[0].damage).toBe(50);
      expect(game.player2.active.damage).toBe(0);
    });
  }

  it('does not borrow Watchful Eye from a Patrat outside play when another print is on the board', () => {
    const game = adrena(mew, 'Patrat BLW 78', dark, ['Patrat M4']);
    game.overridePrompt('Remove damage', () => [{ from: ownActive, to: topActive }]);
    useAbility(game.store, game.state, 0, 'Adrena-Brain');
    expect(game.player1.active.damage).toBe(40);
    expect(game.player2.active.damage).toBe(10);
  });
});

describe('Adrena-Brain movement and opposing placement protection', () => {
  for (const to of [topActive, topBench]) {
    it('uses Battle Cage only on the Benched destination', () => {
      const game = adrena();
      game.player2.stadium.cards.push(getCardByName(cage));
      game.overridePrompt('Remove damage', () => Array(3).fill({ from: ownActive, to }));
      useAbility(game.store, game.state, 0, 'Adrena-Brain');
      expect(game.player1.active.damage).toBe(20);
      expect(game.player2.active.damage).toBe(to === topActive ? 30 : 0);
      expect(game.player2.bench[0].damage).toBe(0);
    });
  }

  it('removes the counters without placing them through Wings of Light', () => {
    const game = adrena(clefable);
    game.overridePrompt('Remove damage', () => Array(2).fill({ from: ownActive, to: topActive }));
    useAbility(game.store, game.state, 0, 'Adrena-Brain');
    expect(game.player1.active.damage).toBe(30);
    expect(game.player2.active.damage).toBe(0);
  });

  it('only accepts damage counters from one friendly Pokémon', () => {
    const game = adrena();
    game.overridePrompt('Remove damage', prompt => {
      expect((prompt as RemoveDamagePrompt).validate([
        { from: ownActive, to: topActive }, { from: ownBench, to: topActive }
      ], game.state)).toBe(false);
      return [{ from: ownBench, to: topActive }, { from: ownBench, to: topActive }];
    });
    useAbility(game.store, game.state, 0, 'Adrena-Brain');
    expect(game.player1.active.damage).toBe(50);
    expect(game.player1.bench[0].damage).toBe(0);
    expect(game.player2.active.damage).toBe(20);
  });

  for (const temple of [false, true]) {
    it('uses the Energy type currently provided by Luminous Energy', () => {
      const game = adrena(mew, mew, 'Luminous Energy PAL');
      if (temple) {
        game.player2.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
        expect(() => useAbility(game.store, game.state, 0, 'Adrena-Brain'))
          .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
      } else {
        game.overridePrompt('Remove damage', () => [{ from: ownActive, to: topActive }]);
        useAbility(game.store, game.state, 0, 'Adrena-Brain');
      }
      expect(game.player2.active.damage).toBe(temple ? 0 : 10);
    });
  }
});

describe('Attack counter movement', () => {
  const attacks = [
    ['Ninetales M4', 'Nine-tailed Reflect', [fire], mew],
    ['Ninetales M4 9', 'Nine-Tailed Transfer', [fire], mew],
    [rocket, 'Rocket Mirror', [psychic, fire], rocket],
  ] as const;
  for (const [card, attack, energy, bench] of attacks) {
    for (const protectedTarget of [false, true]) {
      it(attack + ' removes from the printed source and observes attack protection', () => {
        const game = setupGame({
          turn: 5,
          player1: { active: { card, energy: [...energy] }, bench: [{ card: bench, damage: 40 }], deck: padDeck(10) },
          player2: { active: { card: mew, tools: protectedTarget ? ['Big Parasol DAA'] : [] },
            bench: [{ card: mew, damage: 50 }], deck: padDeck(10) }
        });
        game.overridePrompt('Choose pokemon', () => [ownBench]);
        useAttack(game.store, game.state, 0, attack);
        expect(game.player1.bench[0].damage).toBe(0);
        expect(game.player2.bench[0].damage).toBe(50);
        expect(game.player2.active.damage).toBe(protectedTarget ? 0 : 40);
      });
    }
  }
});
