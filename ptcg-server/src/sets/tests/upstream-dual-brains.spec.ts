import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const magnezone = 'Magnezone PLS';
const tierno = 'Tierno PHF';
const surge = "Lt. Surge's Strategy UNB";

function battle(bench: string[], hand = [tierno, tierno, tierno], abilityLock = false) {
  return setupGame({ turn: 5,
    player1: { active: { card: 'Mew ex MEW' }, bench: bench.map(card => ({ card })), hand, deck: padDeck(20) },
    player2: {
      active: { card: 'Mew ex MEW' }, prizeCount: 4, deck: padDeck(10),
      bench: abilityLock ? [{ card: 'Garbodor DRX', tools: ['Bravery Charm PAL'] }] : []
    }
  });
}

function play(game: ReturnType<typeof battle>, name = tierno) {
  return playTrainerCard(game.store, game.state, 0, name);
}

function canPlay(game: ReturnType<typeof battle>, name = tierno) {
  const card = game.player1.hand.cards.find(candidate => candidate.fullName === name)!;
  return game.player1.playableCardIds.includes(card.id);
}

describe('Magnezone PLS Dual Brains', () => {
  for (const copies of [1, 2]) {
    it(`allows exactly two Supporters with ${copies} Magnezone in play`, () => {
      const game = battle(Array(copies).fill(magnezone));
      play(game);
      expect(canPlay(game)).toBe(true);
      play(game);
      expect(canPlay(game)).toBe(false);
      expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
      expect(game.player1.discard.cards.filter(card => card.fullName === tierno).length).toBe(2);
    });
  }

  it('allows the second Supporter if Magnezone evolves after the first', () => {
    const game = battle(['Magneton PLS'], [tierno, magnezone, tierno, tierno]);
    play(game);
    expect(canPlay(game)).toBe(false);
    const index = game.player1.hand.cards.findIndex(card => card.fullName === magnezone);
    game.store.dispatch(new PlayCardAction(game.player1.id, index, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }));
    expect(canPlay(game)).toBe(true);
    play(game);
    expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
  });

  it('preserves the limit when a different Magnezone supplies Dual Brains', () => {
    const game = battle([magnezone, 'Magneton PLS'], [tierno, tierno, magnezone, tierno]);
    play(game);
    play(game);
    game.player1.bench[0].moveTo(game.player1.discard);
    const index = game.player1.hand.cards.findIndex(card => card.fullName === magnezone);
    game.store.dispatch(new PlayCardAction(game.player1.id, index, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 }));
    expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
  });

  it('allows only one Supporter under Garbotoxin', () => {
    const game = battle([magnezone], undefined, true);
    play(game);
    expect(canPlay(game)).toBe(false);
    expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
  });

  it('refreshes the limit on the player’s next turn', () => {
    const game = battle([magnezone], Array(5).fill(tierno));
    play(game);
    play(game);
    endTurn(game.store, game.state);
    endTurn(game.store, game.state);
    play(game);
    play(game);
    expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
  });

  it('preserves the three-Supporter allowance from Lt. Surge', () => {
    const game = battle([magnezone], [surge, tierno, tierno, tierno]);
    play(game, surge);
    play(game);
    play(game);
    expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
  });

  for (const legacy of [false, true]) {
    it(`counts a Supporter played before Lt. Surge in a ${legacy ? 'legacy' : 'current'} state`, () => {
      const game = battle([magnezone], [tierno, surge, tierno, tierno]);
      play(game);
      if (legacy) delete game.player1.supportersPlayedThisTurn;
      play(game, surge);
      play(game);
      expect(() => play(game)).toThrow(new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED));
    });
  }
});

describe('Magnezone PLS Gyro Ball', () => {
  for (const copied of [false, true]) {
    for (const mode of ['both switch', 'no friendly Bench', 'protected defender'] as const) {
      if (copied && mode === 'no friendly Bench') continue;
      it(`${copied ? 'copied' : 'direct'} Gyro Ball with ${mode}`, () => {
        const active = copied ? 'Mew ex 30C' : magnezone;
        const game = setupGame({ turn: 3,
          player1: {
            active: { card: active, energy: ['Lightning Energy SVE', 'Lightning Energy SVE', 'Water Energy SVE'] },
            bench: mode === 'no friendly Bench' ? [] : [{ card: copied ? magnezone : 'Cleffa OBF' }],
            deck: padDeck(10)
          },
          player2: { active: { card: 'Dragapult ex TWM' }, bench: [{ card: 'Cleffa OBF' }], deck: padDeck(10) }
        });
        const originalAttacker = game.player1.active;
        const originalDefender = game.player2.active;
        originalDefender.preventEffectsOfAttacksNextTurn = mode === 'protected defender';
        if (copied) {
          game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Gyro Ball' }));
          useAbility(game.store, game.state, 0, 'Memory Helix');
        } else {
          useAttack(game.store, game.state, 0, 'Gyro Ball');
        }
        expect(originalDefender.damage).toBe(80);
        expect(game.player1.active === originalAttacker).toBe(mode === 'no friendly Bench');
        expect(game.player2.active !== originalDefender).toBe(mode === 'both switch');
      });
    }
  }
});
